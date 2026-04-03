export type TriviaQuestion = {
  prompt: string;
  choices: string[];
  answerIdx: number;
};

export type HangmanDifficulty = "easy" | "medium" | "hard";

export enum GameName {
  HANGMAN = "HANGMAN",
  TRIVIA = "TRIVIA",
  TIC_TAC_TOE = "TIC_TAC_TOE",
  FLAPPY_BIRD = "FLAPPY_BIRD",
}

export enum GameResult {
  WIN = "WIN",
  LOSS = "LOSS",
  DRAW = "DRAW",
}

export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  bestWinStreak: number;
  currentWinStreak: number;
  lastTenResults: GameResult[];
  highScore?: number; // flappy bird is score-based
}

export type GameStatistics = Partial<Record<GameName, GameStats>>;
