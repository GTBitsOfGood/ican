import GameWrapper from "@/components/games/GameWrapper";
import TicTacToe from "@/components/games/TicTacToe";

export default function TicTacToePage() {
  return <GameWrapper GameComponent={TicTacToe} />;
}
