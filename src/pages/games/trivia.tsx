import GameWrapper from "@/components/games/GameWrapper";
import TriviaGame from "@/components/games/TriviaGame";

export default function SampleGamePage() {
  return <GameWrapper GameComponent={TriviaGame} />;
}
