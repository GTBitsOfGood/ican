export type TriviaQuestion = {
  prompt: string;
  choices: string[];
  answerIdx: number;
  explanation: string;
};

export type HangmanDifficulty = "easy" | "medium" | "hard";

export enum GameName {
  HANGMAN = "HANGMAN",
  TRIVIA = "TRIVIA",
  TIC_TAC_TOE = "TIC_TAC_TOE",
  SAMPLE = "SAMPLE",
}

export enum GameResult {
  WIN = "WIN",
  LOSS = "LOSS",
}

export interface GameStats {
  wins: number;
  losses: number;
  bestWinStreak: number;
  currentWinStreak: number;
  lastTenResults: GameResult[];
}

export type GameStatistics = Partial<Record<GameName, GameStats>>;
