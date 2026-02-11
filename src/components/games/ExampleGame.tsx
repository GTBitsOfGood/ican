import { useEffect } from "react";
import { GameState, type GameWrapperControls } from "./GameWrapper";

export default function ExampleGame({
  setSpeechText,
  gameState,
  setGameState,
  showInformationModal,
}: GameWrapperControls) {
  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Press start to begin!");
      return;
    }
    if (gameState === GameState.PLAYING) {
      setSpeechText("You're playing!");
      return;
    }
    if (gameState === GameState.WON) {
      setSpeechText("Amazing! You have won!");
      return;
    }
    setSpeechText("Nice try!");
  }, [gameState, setSpeechText]);

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-2xl bg-white/50 px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        <p className="text-3xl">Sample Game Area</p>
        <p className="mt-2 text-base">Current state: {gameState}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setGameState(GameState.START)}
            className="rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 shadow-[0_4px_0_0_#7D83B2]"
          >
            Start
          </button>
          <button
            type="button"
            onClick={() => setGameState(GameState.PLAYING)}
            className="rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 shadow-[0_4px_0_0_#7D83B2]"
          >
            Playing
          </button>
          <button
            type="button"
            onClick={() => setGameState(GameState.WON)}
            className="rounded-xl border-4 border-icanBlue-200 bg-icanGreen-300 px-4 py-2 text-white shadow-[0_4px_0_0_#7D83B2]"
          >
            Win
          </button>
          <button
            type="button"
            onClick={() => setGameState(GameState.LOSS)}
            className="rounded-xl border-4 border-icanBlue-200 bg-red-500 px-4 py-2 text-white shadow-[0_4px_0_0_#7D83B2]"
          >
            Lose
          </button>
          <button
            type="button"
            onClick={() =>
              showInformationModal({
                title: "Information Modal",
                message: "This blocks the game until you close it.",
                closeLabel: "Got it",
              })
            }
            className="rounded-xl border-4 border-icanBlue-200 bg-icanBlue-200 px-4 py-2 text-white shadow-[0_4px_0_0_#7D83B2]"
          >
            Info Modal
          </button>
        </div>
      </div>
    </div>
  );
}
