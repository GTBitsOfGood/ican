import GameWrapper from "@/components/games/GameWrapper";
import TriviaGame from "@/components/games/trivia/TriviaGame";
import { GameName } from "@/types/games";

export default function TriviaGamePage() {
  return (
    <GameWrapper
      GameComponent={TriviaGame}
      gameName={GameName.TRIVIA}
      gameAreaClassName="right-[12%]"
    />
  );
}
