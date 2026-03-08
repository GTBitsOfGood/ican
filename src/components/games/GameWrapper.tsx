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

type InformationModalOptions = {
  gameMode?: string;
  title: string;
  message: string;
  letters?: string;
  onClose?: () => void;
};

export interface GameWrapperControls {
  setSpeechText: (text: string) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  showInformationModal: (options: InformationModalOptions) => void;
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
  const [showSuccess, setShowSuccess] = useState(false);
  const [informationModal, setInformationModal] =
    useState<InformationModalOptions | null>(null);

  useEffect(() => {
    if (initialSpeechText && gameState === GameState.START) {
      setSpeechText(initialSpeechText);
    }
  }, [gameState, initialSpeechText]);

  // Show success overlay for 5 seconds on win
  useEffect(() => {
    if (gameState === GameState.WON) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const closeModal = () => {
    const onClose = informationModal?.onClose;
    setInformationModal(null);
    onClose?.();
  };

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
                  "bottom-[24%] left-[12%] right-[10%] top-[12%]",
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

          {/* Success overlay — shown for 5 seconds on win */}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <img
                src="/games/success.svg"
                alt="Success!"
                className="w-full max-w-2xl h-auto px-8"
              />
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/games")}
            className="fixed bottom-6 right-6 z-[67] flex items-center justify-center"
            aria-label="Leave game"
          >
            <img src="/games/leave_game.svg" alt="" className="h-16 w-auto" />
          </button>

          {informationModal && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-8">
              <div className="relative w-full max-w-2xl">
                {/* Card background */}
                <img
                  src="/games/instruction_card.svg"
                  alt=""
                  className="w-full h-auto pointer-events-none select-none"
                />
                {/* X close button */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-[6%] right-[4%] z-10 p-1"
                  aria-label="Close"
                >
                  <img
                    src="/games/instruction_card_X.svg"
                    alt="Close"
                    className="h-7 w-auto"
                  />
                </button>
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%] py-[8%] text-center">
                  {informationModal.gameMode && (
                    <p className="font-quantico text-2xl uppercase mb-5 font-bold text-textBeige">
                      GAME MODE: {informationModal.gameMode}
                    </p>
                  )}
                  <h2 className="font-quantico text-5xl font-bold uppercase mb-5 text-textBeige">
                    {informationModal.title}
                  </h2>
                  <p className="font-quantico text-2xl font-bold leading-relaxed text-textBeige">
                    {informationModal.message}
                  </p>
                  {informationModal.letters && (
                    <p className="font-quantico text-2xl font-bold mt-1 tracking-widest uppercase text-textBeige">
                      {informationModal.letters}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </AuthorizedRoute>
  );
}
