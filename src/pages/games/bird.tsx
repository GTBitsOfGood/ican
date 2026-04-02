import GameWrapper from "@/components/games/GameWrapper";
import BirdGame from "@/components/games/bird/BirdGame";

export default function BirdGamePage() {
  return <GameWrapper GameComponent={BirdGame} />;
}
