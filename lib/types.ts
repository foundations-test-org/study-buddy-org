export type Flashcard = {
  front: string;
  back: string;
};

export type QuizQuestion = {
  question: string;
  choices: string[];
  correctIndex: number;
};

export type Deck = {
  id: string;
  title: string;
  createdAt: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};
