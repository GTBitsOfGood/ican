import GameWrapper from "@/components/games/GameWrapper";
import FlowermanGame from "@/components/games/flowerman/FlowermanGame";

export default function FlowermanGamePage() {
  return (
    <GameWrapper
      GameComponent={FlowermanGame}
      whiteboardSrc="/games/flowerman/whiteboard_flowerman.svg"
      whiteboardContainerClassName="absolute right-20 top-0 w-[55%] aspect-[950/585]"
      gameAreaFrameInsetClassName="bottom-[8%] left-[5%] right-[6%] top-[17.5%]"
    />
  );
}
