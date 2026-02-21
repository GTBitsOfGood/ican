import GameWrapper from "@/components/games/GameWrapper";
import TriviaGame from "@/components/games/TriviaGame";

export default function TriviaGamePage() {
  return <GameWrapper GameComponent={TriviaGame} />;
}
