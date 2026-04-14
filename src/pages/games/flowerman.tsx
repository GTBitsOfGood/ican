import GameWrapper from "@/components/games/GameWrapper";
import FlowermanGame from "@/components/games/flowerman/FlowermanGame";
import { GameName } from "@/types/games";

export default function FlowermanGamePage() {
  return (
    <GameWrapper
      GameComponent={FlowermanGame}
      gameName={GameName.HANGMAN}
      whiteboardSrc="/games/flowerman/whiteboard_flowerman.svg"
      whiteboardContainerClassName="absolute right-20 top-0 w-[55%] aspect-[950/585]"
      gameAreaFrameInsetClassName="pt-[10.8%] pb-[5%] pl-[5.5%] pr-[5.5%]"
      mobileWhiteboardSrc="/games/flowerman/flowerman_mobile.svg"
      mobileGameAreaFrameInsetClassName="pt-[6%] pb-[10%] pl-[6%] pr-[6%]"
      useFlowerGameControls
    />
  );
}
