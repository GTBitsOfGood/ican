import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import PetAppearance from "@/components/inventory/PetAppearance";
import Bubble from "@/components/ui/Bubble";
import ProfileHeader from "@/components/home/ProfileHeader";
import { usePet } from "@/components/hooks/usePet";
import storeItems from "@/lib/storeItems";
import { cn } from "@/lib/utils";

export enum GameState {
  START,
  PLAYING,
  WON,
  LOSS,
  TIE,
}

export interface GameWrapperControls {
  setSpeechText: (text: string) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  showInformationModal: (options: {
    title: string;
    message: string;
    closeLabel?: string;
    onClose?: () => void;
  }) => void;
}

export default function GameWrapper({
  GameComponent,
  initialSpeechText = "",
  showGameAreaFrame = true,
  gameAreaClassName,
}: {
  GameComponent: React.ComponentType<GameWrapperControls>;
  initialSpeechText?: string;
  speechByState?: Partial<Record<GameState, string>>;
  showGameAreaFrame?: boolean;
  gameAreaClassName?: string;
}) {
  const router = useRouter();
  const { data: pet } = usePet();
  const [gameState, setGameState] = useState(GameState.START);
  const [speechText, setSpeechText] = useState(initialSpeechText);
  const [informationModal, setInformationModal] = useState<{
    title: string;
    message: string;
    closeLabel?: string;
    onClose?: () => void;
  } | null>(null);

  useEffect(() => {
    if (initialSpeechText && gameState === GameState.START) {
      setSpeechText(initialSpeechText);
      return;
    }
  }, [gameState, initialSpeechText]);

  // Copy and pasted from the main page, probably a better way to do this or just make a util function
  const equippedBackgroundKey = pet?.appearance?.background;
  const equippedBackgroundFromStore =
    equippedBackgroundKey &&
    storeItems.background[equippedBackgroundKey]?.image;
  const equippedBackgroundImage =
    equippedBackgroundFromStore ||
    (equippedBackgroundKey && equippedBackgroundKey.startsWith("/")
      ? equippedBackgroundKey
      : "/bg-home.svg");

  return (
    <AuthorizedRoute>
      {!pet ? (
        <LoadingScreen />
      ) : (
        <div
          className="relative min-h-screen overflow-hidden bg-no-repeat"
          style={{
            backgroundImage: `url("${equippedBackgroundImage}")`,
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          {/* Profile header */}
          <ProfileHeader
            petType={pet.petType}
            level={pet.xpLevel}
            coins={pet.coins}
            currentExp={pet.xpGained}
          />

          {/* Pet */}
          <div className="absolute left-4 top-[55%] z-10 w-[17rem] -translate-y-1/2 tablet:left-8 tablet:w-[22rem]">
            <div className="relative">
              {speechText && (
                <div className="absolute bottom-[78%] left-[60%] z-20 origin-bottom-left scale-[0.5] tablet:scale-[0.64]">
                  <Bubble text={speechText} />
                </div>
              )}
              <PetAppearance
                petType={pet.petType}
                selectedItem={null}
                appearance={pet.appearance}
                showBackground={false}
                className="h-[17rem] tablet:h-[22rem]"
                characterImageSize={340}
              />
            </div>
          </div>

          {/* Whiteboard */}
          <div className="absolute right-20 top-0 aspect-square w-[50%]">
            {showGameAreaFrame && (
              <img
                src="/games/whiteboard.png"
                className="absolute inset-0 h-full w-full"
                alt=""
                aria-hidden="true"
              />
            )}
            <div
              className={cn(
                "absolute inset-0 overflow-hidden",
                showGameAreaFrame &&
                  "bottom-[24%] left-[8%] right-[10%] top-[25%]",
                gameAreaClassName,
              )}
            >
              <GameComponent
                setSpeechText={setSpeechText}
                gameState={gameState}
                setGameState={setGameState}
                showInformationModal={setInformationModal}
              />
            </div>
          </div>

          {(gameState === GameState.WON ||
            gameState === GameState.LOSS ||
            gameState === GameState.TIE) && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
              <div className="w-full max-w-md rounded-3xl border-4 border-icanBlue-200 bg-white p-6 text-center font-quantico shadow-[0_8px_0_0_#7D83B2]">
                <h2 className="text-3xl text-icanBlue-300">
                  {gameState === GameState.WON
                    ? "You Won!"
                    : gameState === GameState.TIE
                      ? "It's a Tie!"
                      : "Game Over"}
                </h2>
                <p className="mt-2 text-icanBlue-300">
                  {gameState === GameState.WON
                    ? "Good job!"
                    : gameState === GameState.TIE
                      ? "That was close!"
                      : "Nice try!"}
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    className="rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 text-icanBlue-300 shadow-[0_4px_0_0_#7D83B2]"
                    onClick={() => setGameState(GameState.PLAYING)}
                  >
                    Play Again
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border-4 border-icanBlue-200 bg-icanBlue-200 px-4 py-2 text-white shadow-[0_4px_0_0_#7D83B2]"
                    onClick={() => router.push("/games")}
                  >
                    Back to Games
                  </button>
                </div>
              </div>
            </div>
          )}

          {informationModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center font-quantico shadow-[0_8px_0_0_#7D83B2]">
                <h2 className="text-3xl text-icanBlue-300">
                  {informationModal.title}
                </h2>
                <p className="mt-3 text-icanBlue-300">
                  {informationModal.message}
                </p>
                <button
                  type="button"
                  className="mt-6 rounded-xl bg-icanBlue-200 px-5 py-2 text-white shadow-[0_4px_0_0_#7D83B2]"
                  onClick={() => {
                    const onClose = informationModal.onClose;
                    setInformationModal(null);
                    onClose?.();
                  }}
                >
                  {informationModal.closeLabel || "Close"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AuthorizedRoute>
  );
}
