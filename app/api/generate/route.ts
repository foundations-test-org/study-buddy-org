import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { Deck, Flashcard, QuizQuestion } from "@/lib/types";

const MAX_NOTES_LENGTH = 20000;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to .env.local." },
      { status: 500 }
    );
  }

  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json(
      {
        error:
          "Server is missing SUPABASE_URL or SUPABASE_SECRET_KEY. Add them to .env.local.",
      },
      { status: 500 }
    );
  }

  const body = await req.json().catch(() => null);
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  if (!notes) {
    return NextResponse.json({ error: "Paste some notes first." }, { status: 400 });
  }
  if (notes.length > MAX_NOTES_LENGTH) {
    return NextResponse.json(
      { error: `Notes are too long (max ${MAX_NOTES_LENGTH} characters).` },
      { status: 400 }
    );
  }

  const anthropic = new Anthropic({ apiKey });

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 4096,
    system:
      "You turn study notes into study material. Respond with ONLY a JSON object " +
      "matching this shape, no prose, no markdown fences: " +
      '{"title": string, "flashcards": [{"front": string, "back": string}], ' +
      '"quiz": [{"question": string, "choices": [string, string, string, string], "correctIndex": number}]}. ' +
      "Produce 6-10 flashcards and 4-6 quiz questions drawn only from the given notes. " +
      "correctIndex is a 0-based index into choices.",
    messages: [
      {
        role: "user",
        content: `Generate flashcards and a quiz from these notes:\n\n${notes}`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return NextResponse.json({ error: "Model returned no text." }, { status: 502 });
  }

  let parsed: {
    title?: string;
    flashcards?: Flashcard[];
    quiz?: QuizQuestion[];
  };
  try {
    parsed = JSON.parse(extractJson(textBlock.text));
  } catch {
    return NextResponse.json(
      { error: "Could not parse model output as JSON." },
      { status: 502 }
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("decks")
    .insert({
      title: parsed.title || "Untitled deck",
      flashcards: parsed.flashcards || [],
      quiz: parsed.quiz || [],
    })
    .select("id, title, flashcards, quiz, created_at")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  const deck: Deck = {
    id: inserted.id,
    title: inserted.title,
    createdAt: inserted.created_at,
    flashcards: inserted.flashcards,
    quiz: inserted.quiz,
  };

  return NextResponse.json(deck);
}

function extractJson(text: string): string {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) return text;
  return text.slice(start, end + 1);
}
