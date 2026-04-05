import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import { triviaQuestions } from "@/lib/triviaQuestions";
import QuestionCard from "./QuestionCard";
import { GameName, GameResult, TriviaQuestion } from "@/types/games";
import { useUser } from "@/components/UserContext";
import {
  useGameStatistics,
  useRecordGameResult,
} from "@/components/hooks/useGameStatistics";
import { GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";

function generateRoundQuestions(): TriviaQuestion[] {
  const shuffled = [...triviaQuestions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, 5);
}

export default function TriviaGame({
  setSpeechText,
  gameState,
  setGameState,
  showInformationModal,
  setWinRewardDetails,
}: GameWrapperControls) {
  const { userId } = useUser();
  const { data: gameStatistics } = useGameStatistics(userId);
  const recordGameResult = useRecordGameResult();
  const [currQuestionIdx, setCurrQuestionIdx] = useState<number>(0);
  const [roundQuestions, setRoundQuestions] = useState<TriviaQuestion[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(
    null,
  );
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isProcessingWin, setIsProcessingWin] = useState(false);

  const [showXpPopup, setShowXpPopup] = useState(false);
  const hasAutoStartedRef = useRef(false);
  const xpTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLastQuestion = currQuestionIdx === roundQuestions.length - 1;

  useEffect(() => {
    return () => {
      if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
    };
  }, []);

  const handleStart = useCallback(() => {
    showInformationModal({
      gameMode: "TRIVIA",
      title: "INSTRUCTIONS",
      message:
        "Your pet will ask you a series of questions.\nSelect the answer you think is right!\n\nGet 10 XP for each correct answer.",
      onClose: () => setGameState(GameState.PLAYING),
    });
  }, [showInformationModal, setGameState]);

  useEffect(() => {
    if (gameState === GameState.START && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      handleStart();
    }
    if (gameState === GameState.PLAYING) {
      const newQuestions = generateRoundQuestions();
      setCurrQuestionIdx(0);
      setRoundQuestions(newQuestions);
      setIsSubmitted(false);
      setSelectedChoiceIdx(null);
      setCorrectAnswers(0);
      setSpeechText(newQuestions[0].prompt);
    }
  }, [gameState, handleStart, setSpeechText]);

  const buttonClassName =
    "w-full border-[2px] border-black bg-icanGreen-200 py-1 font-quantico text-sm wideGame:text-lg font-bold leading-none text-black disabled:opacity-50";

  const handleAnswer = (idx: number) => {
    if (isSubmitted) return;
    setSelectedChoiceIdx(idx);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    if (selectedChoiceIdx === null) return;

    const isCorrect =
      selectedChoiceIdx === roundQuestions[currQuestionIdx].answerIdx;
    const nextCorrectAnswers = correctAnswers + (isCorrect ? 1 : 0);
    const correctLetter = ["A", "B", "C", "D"][
      roundQuestions[currQuestionIdx].answerIdx
    ];

    setSpeechText(
      isCorrect
        ? "Great job!"
        : `Nice try! The correct answer was ${correctLetter}.`,
    );

    if (isCorrect) {
      setCorrectAnswers(nextCorrectAnswers);
      setShowXpPopup(true);
      if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
      xpTimerRef.current = setTimeout(() => setShowXpPopup(false), 1200);
    }

    if (isLastQuestion) {
      if (nextCorrectAnswers >= 3) {
        handleGameWin();
      } else {
        if (userId) {
          void recordGameResult.mutateAsync({
            userId,
            gameName: GameName.TRIVIA,
            result: GameResult.LOSS,
          });
        }
        setGameState(GameState.LOSS);
        setSpeechText(
          `You got ${nextCorrectAnswers}/5 correct. Let's try again!`,
        );
      }
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(true);
  };

  const handleGameWin = async () => {
    if (!userId || isProcessingWin) return;

    setIsProcessingWin(true);
    setWinRewardDetails?.(null);

    try {
      const coinsAlreadyEarned = gameStatistics?.coinsEarnedToday ?? 0;
      const stats = await recordGameResult.mutateAsync({
        userId,
        gameName: GameName.TRIVIA,
        result: GameResult.WIN,
      });
      const actualCoinsEarned = Math.max(
        0,
        stats.coinsEarnedToday - coinsAlreadyEarned,
      );

      setGameState(GameState.WON);

      const updatedDailyCoins = Math.min(
        stats.coinsEarnedToday,
        GAMES_DAILY_COIN_LIMIT,
      );

      setWinRewardDetails?.({
        coinsEarned: actualCoinsEarned,
        dailyCoinsTotal: updatedDailyCoins,
        maxCoinsPerDay: GAMES_DAILY_COIN_LIMIT,
        maxReached: actualCoinsEarned === 0,
      });
    } catch (error) {
      console.error("Error processing game win:", error);
      setGameState(GameState.WON);
      setWinRewardDetails?.(null);
      showInformationModal({
        title: "YOU WIN!",
        message: "Congratulations! You completed the game!",
      });
    } finally {
      setIsProcessingWin(false);
    }
  };

  const handlePlayAgain = () => {
    setShowXpPopup(false);
    setGameState(GameState.PLAYING);
  };

  const handleNextQuestion = () => {
    const nextQuestionIdx = currQuestionIdx + 1;

    if (nextQuestionIdx >= roundQuestions.length) {
      return;
    }

    setIsSubmitted(false);
    setSelectedChoiceIdx(null);
    setShowXpPopup(false);

    setCurrQuestionIdx(nextQuestionIdx);
    setSpeechText(roundQuestions[nextQuestionIdx].prompt);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-2 wideGame:px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        {gameState === GameState.PLAYING && roundQuestions.length > 0 && (
          <>
            {showXpPopup && (
              <img
                src="/games/trivia/Notification.svg"
                alt="Correct XP +10"
                className="pointer-events-none absolute right-[8%] top-[6%] z-20 w-[60px] wideGame:w-[110px] animate-xpFloat"
                draggable={false}
                style={{ imageRendering: "pixelated" }}
              />
            )}
            <div className="mt-2 wideGame:mt-8 flex w-full flex-col items-center gap-2 wideGame:gap-6">
              <QuestionCard
                question={roundQuestions[currQuestionIdx]}
                onAnswer={handleAnswer}
                isAnswered={isSubmitted}
                selectedChoiceIdx={selectedChoiceIdx}
                currentQuestionNumber={currQuestionIdx + 1}
              />
              <button
                type="button"
                onClick={!isSubmitted ? handleSubmit : handleNextQuestion}
                disabled={!isSubmitted && selectedChoiceIdx === null}
                className={buttonClassName}
              >
                {!isSubmitted ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
        {(gameState === GameState.WON || gameState === GameState.LOSS) &&
          roundQuestions.length > 0 && (
            <>
              <div className="mt-2 wideGame:mt-8 flex w-full flex-col items-center gap-2 wideGame:gap-6">
                <QuestionCard
                  question={roundQuestions[currQuestionIdx]}
                  onAnswer={() => {}}
                  isAnswered={true}
                  selectedChoiceIdx={selectedChoiceIdx}
                  currentQuestionNumber={currQuestionIdx + 1}
                />
                <button
                  type="button"
                  onClick={handlePlayAgain}
                  className={buttonClassName}
                >
                  Play Again
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
}
