import GameWrapper from "@/components/games/GameWrapper";
import TicTacToe from "@/components/games/tictactoe/TicTacToe";
import { GameName } from "@/types/games";

export default function TicTacToePage() {
  return (
    <GameWrapper
      GameComponent={TicTacToe}
      gameName={GameName.TIC_TAC_TOE}
      whiteboardContainerClassName="absolute right-40 top-0 aspect-square w-[50%]"
    />
  );
}
