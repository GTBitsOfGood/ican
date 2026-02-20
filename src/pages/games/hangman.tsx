import GameWrapper from "@/components/games/GameWrapper";
import HangmanGame from "@/components/games/HangmanGame";

export default function HangmanGamePage() {
  return <GameWrapper GameComponent={HangmanGame} />;
}
