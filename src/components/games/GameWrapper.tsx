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
  gameName,
  initialSpeechText = "",
  showGameAreaFrame = true,
  gameAreaClassName,
  whiteboardSrc = "/games/whiteboard.png",
  whiteboardContainerClassName = "absolute right-20 top-0 aspect-square w-[50%]",
  gameAreaFrameInsetClassName = "pt-[17%] pb-[15%] pl-[7%] pr-[9%]",
  mobileWhiteboardSrc = "/games/whiteboard_mobile.svg",
  mobileGameAreaFrameInsetClassName = "pt-[9%] pb-[16%] pl-[7%] pr-[9%]",
  useFlowerGameControls = false,
}: {
  GameComponent: React.ComponentType<GameWrapperControls>;
  gameName?: string;
  initialSpeechText?: string;
  showGameAreaFrame?: boolean;
  gameAreaClassName?: string;
  whiteboardSrc?: string;
  whiteboardContainerClassName?: string;
  gameAreaFrameInsetClassName?: string;
  mobileWhiteboardSrc?: string;
  mobileGameAreaFrameInsetClassName?: string;
  useFlowerGameControls?: boolean;
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
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 650px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 650px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

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
        <div className="relative min-h-screen overflow-hidden">
          <div
            className="absolute inset-0 z-0 bg-cover bg-bottom bg-no-repeat"
            style={{
              backgroundImage: `url("${equippedBackgroundImage}")`,
              backgroundPosition: "center bottom",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-black/55"
            aria-hidden
          />

          <div className="relative z-10 min-h-screen">
            {/* Mobile banner — visible only below 650px */}
            {gameName && isMobile && (
              <div
                className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2 shadow-[0_6px_16px_4px_rgba(0,0,0,0.45)]"
                style={{
                  backgroundColor: "#2D336B",
                  borderBottom: "1px solid #232540",
                }}
              >
                <span className="font-quantico text-xl font-bold uppercase text-white">
                  {gameName}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/games")}
                    className="flex items-center justify-center"
                    aria-label="Leave game"
                  >
                    <img
                      src="/games/leave_game_new.svg"
                      alt=""
                      className="h-10 w-auto"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center"
                    aria-label="Restart game"
                  >
                    <img
                      src="/games/restart_new.svg"
                      alt=""
                      className="h-10 w-auto"
                    />
                  </button>
                </div>
              </div>
            )}

            {isMobile ? (
              /* ── Mobile layout (<650px): pet flush above board, both same width ── */
              <div
                className="fixed inset-0 flex flex-col items-center justify-end"
                style={{ paddingTop: gameName ? "3rem" : 0 }}
              >
                {/* Pet — width-based sizing matching desktop proportions, aligned bottom-left */}
                {petBoardX === null && (
                  <div
                    className="relative flex flex-1 items-end justify-start"
                    style={{ width: "min(100vw, calc(60vh * 393 / 510))" }}
                  >
                    <div className="relative" style={{ width: "28%" }}>
                      {speechText && (
                        <div className="absolute bottom-[78%] left-[60%] z-20 origin-bottom-left scale-[0.5]">
                          <Bubble text={speechText} />
                        </div>
                      )}
                      <PetAppearance
                        petType={pet.petType}
                        selectedItem={null}
                        appearance={pet.appearance}
                        showBackground={false}
                        className="h-auto w-full"
                        characterImageSize={300}
                        emotion={petEmotion ?? PetEmotion.NEUTRAL}
                      />
                    </div>
                  </div>
                )}
                {/* Mobile whiteboard */}
                <div
                  className="relative shrink-0"
                  style={{
                    width: "min(100vw, calc(60vh * 393 / 510))",
                    aspectRatio: "393 / 510",
                  }}
                >
                  {showGameAreaFrame && (
                    <img
                      src={mobileWhiteboardSrc}
                      className="absolute inset-0 h-full w-full"
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      showGameAreaFrame && mobileGameAreaFrameInsetClassName,
                    )}
                  >
                    <div
                      className={cn(
                        "h-full w-full overflow-hidden",
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
                </div>
              </div>
            ) : (
              /* ── Desktop layout (≥1400px): pet left, board top-right ── */
              <>
                {/* Pet to the left of the board */}
                {petBoardX === null && (
                  <div
                    className="absolute left-[1vw] top-[55%] -translate-y-1/2"
                    style={{ width: "min(22rem, 18vw)" }}
                  >
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
                        className="h-auto w-full"
                        characterImageSize={340}
                      />
                    </div>
                  </div>
                )}
                {/* Desktop whiteboard */}
                <div className={whiteboardContainerClassName}>
                  {showGameAreaFrame && (
                    <img
                      src={whiteboardSrc}
                      className="absolute inset-0 h-full w-full"
                      alt=""
                      aria-hidden="true"
                    />
                  )}
                  {petBoardX !== null && (
                    <div className="absolute top-[35%] inset-0 z-20 flex items-center justify-center pointer-events-none">
                      <div
                        style={{
                          width: "min(22rem, 18vw)",
                          transform: `translateX(${petBoardX}%)`,
                        }}
                      >
                        <PetAppearance
                          petType={pet.petType}
                          selectedItem={null}
                          appearance={pet.appearance}
                          showBackground={false}
                          className="h-auto w-full"
                          characterImageSize={340}
                          emotion={petEmotion ?? PetEmotion.NEUTRAL}
                        />
                      </div>
                    </div>
                  )}
                  <div
                    className={cn(
                      "absolute inset-0 flex items-center justify-center",
                      showGameAreaFrame && gameAreaFrameInsetClassName,
                    )}
                  >
                    <div
                      className={cn(
                        "h-full w-full overflow-hidden",
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
                </div>
              </>
            )}

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

            {!isMobile && (
              <div
                className={cn(
                  "fixed right-4 z-[67] flex flex-col items-end gap-2 tablet:right-6",
                  useFlowerGameControls
                    ? "bottom-4 tablet:bottom-6"
                    : "top-4 tablet:top-6",
                )}
              >
                <button
                  type="button"
                  onClick={() => router.push("/games")}
                  className="flex items-center justify-center"
                  aria-label="Leave game"
                >
                  <img
                    src="/games/leave_game_new.svg"
                    alt=""
                    className="w-32 h-auto"
                  />
                </button>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex items-center justify-center"
                  aria-label="Restart game"
                >
                  <img
                    src="/games/restart_new.svg"
                    alt=""
                    className="w-32 h-auto"
                  />
                </button>
              </div>
            )}

            {informationModal && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-8">
                <div className="relative w-full max-w-2xl">
                  {/* Card background */}
                  <img
                    src="/games/instruction_card.svg"
                    alt=""
                    className="w-full h-auto pointer-events-none select-none"
                  />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%] py-[8%] text-center">
                    {informationModal.gameMode && (
                      <p className="font-quantico uppercase mb-2 smallTablet:mb-5 font-bold text-textBeige text-sm smallTablet:text-2xl">
                        GAME MODE: {informationModal.gameMode}
                      </p>
                    )}
                    <h2 className="font-quantico font-bold uppercase mb-2 smallTablet:mb-5 text-textBeige text-xl smallTablet:text-5xl">
                      {informationModal.title}
                    </h2>
                    <p className="font-quantico font-bold leading-relaxed text-textBeige text-xs smallTablet:text-2xl">
                      {informationModal.message}
                    </p>
                    {informationModal.letters && (
                      <p className="font-quantico font-bold mt-1 tracking-widest uppercase text-textBeige text-xs smallTablet:text-2xl">
                        {informationModal.letters}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={closeModal}
                      className="mt-2 smallTablet:mt-5 border-[2px] border-black bg-icanGreen-200 px-10 py-1 font-quantico text-sm font-bold leading-none text-black smallTablet:text-lg smallTablet:py-2"
                    >
                      Begin
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AuthorizedRoute>
  );
}
