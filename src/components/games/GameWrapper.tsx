import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import PetAppearance from "@/components/inventory/PetAppearance";
import Bubble from "@/components/ui/Bubble";
import { usePet } from "@/components/hooks/usePet";
import {
  useGameStatistics,
  useRecordGameResult,
} from "@/components/hooks/useGameStatistics";
import { useUser } from "@/components/UserContext";
import CoinLimitModal from "@/components/games/CoinLimitModal";
import storeItems from "@/lib/storeItems";
import { cn } from "@/lib/utils";
import gameConfig from "@/lib/gameConfig";
import { PetEmotion } from "@/types/pet";
import { DAILY_COIN_LIMIT, GameName, GameResult } from "@/types/games";

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
  setPetBoardX?: (percent: number | null) => void;
  setPetEmotion?: (emotion: PetEmotion | null) => void;
  recordResult?: (result: GameResult) => void;
}

export default function GameWrapper({
  GameComponent,
  gameName,
  initialSpeechText = "",
  showGameAreaFrame = true,
  manualRecording = false,
  gameAreaClassName,
  whiteboardSrc = "/games/whiteboard.png",
  whiteboardContainerClassName = "absolute right-20 top-0 aspect-square w-[50%]",
  gameAreaFrameInsetClassName = "bottom-[24%] left-[12%] right-[10%] top-[14%]",
}: {
  GameComponent: React.ComponentType<GameWrapperControls>;
  gameName?: GameName;
  initialSpeechText?: string;
  speechByState?: Partial<Record<GameState, string>>;
  showGameAreaFrame?: boolean;
  manualRecording?: boolean;
  gameAreaClassName?: string;
  whiteboardSrc?: string;
  whiteboardContainerClassName?: string;
  gameAreaFrameInsetClassName?: string;
}) {
  const router = useRouter();
  const { data: pet } = usePet();
  const { userId } = useUser();
  const recordGameResult = useRecordGameResult();
  const { data: statsData } = useGameStatistics(userId);
  const [gameState, setGameState] = useState(GameState.START);
  const [speechText, setSpeechText] = useState(initialSpeechText);
  const [showSuccess, setShowSuccess] = useState(false);
  const [coinLimitDismissed, setCoinLimitDismissed] = useState(false);
  const [informationModal, setInformationModal] =
    useState<InformationModalOptions | null>(null);
  const [petBoardX, setPetBoardX] = useState<number | null>(null);
  const [petEmotion, setPetEmotion] = useState<PetEmotion | null>(null);
  const hasRecordedRef = useRef(false);

  const coinsEarnedToday = statsData?.coinsEarnedToday ?? 0;
  const atCoinLimit = coinsEarnedToday >= DAILY_COIN_LIMIT;
  const displayName =
    gameConfig.find((g) => g.gameName === gameName)?.name ?? "";

  const showCoinLimitModal = atCoinLimit && !coinLimitDismissed;

  useEffect(() => {
    if (manualRecording || !gameName || !userId) return;
    if (gameState === GameState.START || gameState === GameState.PLAYING) {
      hasRecordedRef.current = false;
      return;
    }
    if (hasRecordedRef.current) return;
    hasRecordedRef.current = true;

    const resultMap: Record<number, GameResult> = {
      [GameState.WON]: GameResult.WIN,
      [GameState.LOSS]: GameResult.LOSS,
      [GameState.TIE]: GameResult.DRAW,
    };
    const result = resultMap[gameState];
    if (result) {
      recordGameResult.mutate({ userId, gameName, result });
    }
  }, [gameState, gameName, userId, recordGameResult, manualRecording]);

  const handleRecordResult = useCallback(
    (result: GameResult) => {
      if (gameName && userId) {
        recordGameResult.mutate({ userId, gameName, result });
      }
    },
    [gameName, userId, recordGameResult],
  );

  const derivedSpeechText =
    initialSpeechText && gameState === GameState.START
      ? initialSpeechText
      : speechText;

  const handleSetGameState = useCallback((state: GameState) => {
    setGameState(state);
    if (state === GameState.WON) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    }
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
          {/* Pet at default home position with speech bubble */}
          {petBoardX === null && (
            <div className="absolute left-4 top-[55%] z-10 w-[17rem] -translate-y-1/2 tablet:left-8 tablet:w-[22rem]">
              <div className="relative">
                {derivedSpeechText && (
                  <div className="absolute bottom-[78%] left-[60%] z-20 origin-bottom-left scale-[0.5] tablet:scale-[0.64]">
                    <Bubble text={derivedSpeechText} />
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
                setGameState={handleSetGameState}
                showInformationModal={setInformationModal}
                setPetBoardX={setPetBoardX}
                setPetEmotion={setPetEmotion}
                recordResult={handleRecordResult}
              />
            </div>
          </div>

          {/* Success overlay — shown for 5 seconds on win */}
          {showSuccess && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer"
              onClick={() => setShowSuccess(false)}
            >
              <img
                src="/assets/CongratulationsBackdrop.svg"
                alt="Success!"
                className="w-[900px] max-w-[80vw] h-auto"
              />
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

          {showCoinLimitModal && (
            <CoinLimitModal
              gameName={displayName}
              onGoBack={() => router.push("/games")}
              onPlay={() => setCoinLimitDismissed(true)}
            />
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
