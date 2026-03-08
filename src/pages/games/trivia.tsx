import GameWrapper from "@/components/games/GameWrapper";
import TriviaGame from "@/components/games/trivia/TriviaGame";

export default function TriviaGamePage() {
  return (
    <GameWrapper GameComponent={TriviaGame} gameAreaClassName="right-[12%]" />
  );
}
