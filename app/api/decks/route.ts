import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";
import { Deck } from "@/lib/types";

const MISSING_ENV_ERROR =
  "Server is missing SUPABASE_URL or SUPABASE_SECRET_KEY. Add them to .env.local.";

export async function GET() {
  let supabase;
  try {
    supabase = getSupabaseServerClient();
  } catch {
    return NextResponse.json({ error: MISSING_ENV_ERROR }, { status: 500 });
  }

  const { data, error } = await supabase
    .from("decks")
    .select("id, title, flashcards, quiz, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const decks: Deck[] = (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    flashcards: row.flashcards,
    quiz: row.quiz,
  }));

  return NextResponse.json(decks);
}
