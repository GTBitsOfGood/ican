export type TriviaQuestion = {
  prompt: string;
  choices: string[];
  answerIdx: number;
  explanation: string;
};

export type HangmanDifficulty = "easy" | "medium" | "hard";
