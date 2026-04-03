import { GameName } from "@/types/games";

export interface GameConfig {
  name: string;
  gameName: GameName;
  banner: string;
  href: string;
}

const gameConfig: GameConfig[] = [
  {
    name: "Tic-Tac-Toe",
    gameName: GameName.TIC_TAC_TOE,
    banner: "/games/tictactoe.png",
    href: "/games/tictactoe",
  },
  {
    name: "Trivia",
    gameName: GameName.TRIVIA,
    banner: "/games/trivia.png",
    href: "/games/trivia",
  },
  {
    name: "Flowerman",
    gameName: GameName.HANGMAN,
    banner: "/games/flowerman.png",
    href: "/games/flowerman",
  },
];

export default gameConfig;
