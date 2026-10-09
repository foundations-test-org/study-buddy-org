"use client";

import { useState } from "react";
import { Flashcard } from "@/lib/types";

export default function FlashcardViewer({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;
  const card = cards[index];

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => (i + delta + cards.length) % cards.length);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => setFlipped((f) => !f)}
        className="w-full max-w-lg min-h-48 rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-sm transition hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
      >
        <p className="text-xs uppercase tracking-wide text-neutral-400">
          {flipped ? "Answer" : "Question"} · {index + 1}/{cards.length}
        </p>
        <p className="mt-4 text-lg">{flipped ? card.back : card.front}</p>
        <p className="mt-4 text-xs text-neutral-400">Click to flip</p>
      </button>
      <div className="flex gap-3">
        <button
          onClick={() => go(-1)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Previous
        </button>
        <button
          onClick={() => go(1)}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          Next
        </button>
      </div>
    </div>
  );
}
