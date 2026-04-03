import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import PetAppearance from "@/components/inventory/PetAppearance";
import Bubble from "@/components/ui/Bubble";
import { usePet } from "@/components/hooks/usePet";
import storeItems from "@/lib/storeItems";
import { cn } from "@/lib/utils";
import { PetEmotion } from "@/types/pet";

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

type WinRewardDetails = {
  coinsEarned: number;
  dailyCoinsTotal: number;
  maxCoinsPerDay: number;
  maxReached: boolean;
};

export interface GameWrapperControls {
  setSpeechText: (text: string) => void;
  gameState: GameState;
  setGameState: (state: GameState) => void;
  showInformationModal: (options: InformationModalOptions) => void;
  setPetBoardX?: (percent: number | null) => void;
  setPetEmotion?: (emotion: PetEmotion | null) => void;
  setWinRewardDetails?: (details: WinRewardDetails | null) => void;
}

export default function GameWrapper({
  GameComponent,
  initialSpeechText = "",
  showGameAreaFrame = true,
  gameAreaClassName,
  whiteboardSrc = "/games/whiteboard.png",
  whiteboardContainerClassName = "absolute right-20 top-0 aspect-square w-[50%]",
  gameAreaFrameInsetClassName = "bottom-[24%] left-[12%] right-[10%] top-[14%]",
}: {
  GameComponent: React.ComponentType<GameWrapperControls>;
  gameName?: string;
  initialSpeechText?: string;
  showGameAreaFrame?: boolean;
  gameAreaClassName?: string;
  whiteboardSrc?: string;
  whiteboardContainerClassName?: string;
  gameAreaFrameInsetClassName?: string;
}) {
  const router = useRouter();
  const { data: pet } = usePet();
  const [gameState, setInternalGameState] = useState(GameState.START);
  const [speechText, setSpeechText] = useState(initialSpeechText);
  const [showSuccess, setShowSuccess] = useState(false);
  const [informationModal, setInformationModal] =
    useState<InformationModalOptions | null>(null);
  const [petBoardX, setPetBoardX] = useState<number | null>(null);
  const [petEmotion, setPetEmotion] = useState<PetEmotion | null>(null);
  const [winRewardDetails, setWinRewardDetails] =
    useState<WinRewardDetails | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetSuccessState = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    setShowSuccess(false);
  }, []);

  const handleGameStateChange = useCallback(
    (state: GameState) => {
      setInternalGameState(state);

      if (state === GameState.START && initialSpeechText) {
        setSpeechText(initialSpeechText);
      }

      if (state === GameState.WON) {
        setShowSuccess(true);
        if (successTimerRef.current) {
          clearTimeout(successTimerRef.current);
        }
        successTimerRef.current = setTimeout(() => {
          setShowSuccess(false);
          successTimerRef.current = null;
        }, 5000);
      } else {
        resetSuccessState();
        if (winRewardDetails !== null) {
          setWinRewardDetails(null);
        }
      }
    },
    [initialSpeechText, resetSuccessState, winRewardDetails],
  );

  useEffect(() => {
    return () => {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

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
          <div
            className="pointer-events-none absolute inset-0 bg-black/60"
            aria-hidden="true"
          />

          {/* Pet at default home position with speech bubble */}
          {petBoardX === null && (
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
          )}

          {/* Whiteboard */}
          <div className={whiteboardContainerClassName}>
            {showGameAreaFrame && (
              <img
                src={whiteboardSrc}
                className={"absolute inset-0 h-full w-full"}
                alt=""
                aria-hidden="true"
              />
            )}
            {/* Pet overlaid on the board when an X translation is provided */}
            {petBoardX !== null && (
              <div className="absolute top-[35%] inset-0 z-20 flex items-center justify-center pointer-events-none">
                <div
                  style={{
                    transform: `translateX(${petBoardX}%)`,
                  }}
                >
                  <PetAppearance
                    petType={pet.petType}
                    selectedItem={null}
                    appearance={pet.appearance}
                    showBackground={false}
                    className="h-[17rem] tablet:h-[22rem]"
                    characterImageSize={340}
                    emotion={petEmotion ?? PetEmotion.NEUTRAL}
                  />
                </div>
              </div>
            )}
            <div
              className={cn(
                "absolute inset-0 overflow-hidden",
                showGameAreaFrame && gameAreaFrameInsetClassName,
                gameAreaClassName,
              )}
            >
              <GameComponent
                setSpeechText={setSpeechText}
                gameState={gameState}
                setGameState={handleGameStateChange}
                showInformationModal={setInformationModal}
                setPetBoardX={setPetBoardX}
                setPetEmotion={setPetEmotion}
                setWinRewardDetails={setWinRewardDetails}
              />
            </div>
          </div>

          {/* Success overlay on win */}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="relative w-full max-w-6xl px-4">
                <img
                  src="/assets/CongratulationsBackdrop.svg"
                  alt="Success!"
                  className="w-full h-auto"
                />
                {winRewardDetails && (
                  <div className="absolute left-1/2 top-1/2 flex w-[85%] max-w-xl -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4 rounded-full bg-white/95 px-10 py-4 shadow-[0_6px_0_0_#7D83B2]">
                    {winRewardDetails.maxReached ? (
                      <p className="font-quantico text-3xl uppercase tracking-wide text-icanBlue-300">
                        Max coins reached
                      </p>
                    ) : (
                      <>
                        <img
                          src="/icons/Coin.svg"
                          alt="Coins"
                          className="h-12 w-12"
                          draggable={false}
                        />
                        <p className="font-quantico text-3xl uppercase text-icanBlue-300 whitespace-nowrap">
                          Daily Coins: {winRewardDetails.dailyCoinsTotal}/
                          {winRewardDetails.maxCoinsPerDay}
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/games")}
            className="fixed top-[15px] right-[5px] z-[67] flex items-center justify-center"
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
