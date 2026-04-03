import GameWrapper from "@/components/games/GameWrapper";
import TicTacToe from "@/components/games/TicTacToe";
import { GameName } from "@/types/games";

export default function TicTacToePage() {
  return (
    <GameWrapper GameComponent={TicTacToe} gameName={GameName.TIC_TAC_TOE} />
  );
}
