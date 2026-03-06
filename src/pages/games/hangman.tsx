import GameWrapper from "@/components/games/GameWrapper";
import FlowermanGame from "@/components/games/flowerman/FlowermanGame";

export default function FlowermanGamePage() {
  return <GameWrapper GameComponent={FlowermanGame} />;
}
