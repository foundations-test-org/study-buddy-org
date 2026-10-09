import { Deck } from "./types";

async function readError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => null);
  return data?.error || fallback;
}

export async function fetchDecks(): Promise<Deck[]> {
  const res = await fetch("/api/decks");
  if (!res.ok) throw new Error(await readError(res, "Failed to load decks."));
  return res.json();
}

export async function generateDeck(notes: string): Promise<Deck> {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes }),
  });
  if (!res.ok) throw new Error(await readError(res, "Failed to generate deck."));
  return res.json();
}

export async function deleteDeck(id: string): Promise<void> {
  const res = await fetch(`/api/decks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await readError(res, "Failed to delete deck."));
}
