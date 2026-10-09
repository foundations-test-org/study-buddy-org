"use client";

import { useState } from "react";
import { QuizQuestion } from "@/lib/types";

export default function QuizMode({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  if (questions.length === 0) return null;

  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {questions.map((q, qi) => (
        <div
          key={qi}
          className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-900"
        >
          <p className="font-medium">
            {qi + 1}. {q.question}
          </p>
          <div className="mt-3 flex flex-col gap-2">
            {q.choices.map((choice, ci) => {
              const isSelected = answers[qi] === ci;
              const isCorrect = submitted && ci === q.correctIndex;
              const isWrongSelected = submitted && isSelected && ci !== q.correctIndex;
              return (
                <button
                  key={ci}
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [qi]: ci }))}
                  className={[
                    "rounded-md border px-3 py-2 text-left text-sm transition",
                    isSelected ? "border-blue-500" : "border-neutral-200 dark:border-neutral-700",
                    isCorrect ? "bg-green-50 border-green-500 dark:bg-green-950" : "",
                    isWrongSelected ? "bg-red-50 border-red-500 dark:bg-red-950" : "",
                  ].join(" ")}
                >
                  {choice}
                </button>
              );
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < questions.length}
          className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm text-white disabled:opacity-40 dark:bg-white dark:text-neutral-900"
        >
          Submit answers
        </button>
      ) : (
        <p className="text-lg font-medium">
          Score: {score} / {questions.length}
        </p>
      )}
    </div>
  );
}
