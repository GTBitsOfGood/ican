import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import { triviaQuestions } from "@/lib/triviaQuestions";
import QuestionCard from "./QuestionCard";
import { TriviaQuestion } from "@/types/games";
import { useUser } from "@/components/UserContext";
import GameStatsHTTPClient from "@/http/gameStatsHTTPClient";
import GameRewardsService from "@/services/gameRewards";
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
  const [currQuestionIdx, setCurrQuestionIdx] = useState<number>(0);
  const [roundQuestions, setRoundQuestions] = useState<TriviaQuestion[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(
    null,
  );
  const [isProcessingWin, setIsProcessingWin] = useState(false);

  const isLastQuestion = currQuestionIdx === roundQuestions.length - 1;

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
      setSpeechText(newQuestions[0].prompt);
    }
  }, [gameState, handleStart, setSpeechText]);

  const buttonClassName =
    "fixed right-[6%] bottom-[18%] z-50 border-[3px] border-black bg-icanGreen-200 px-12 py-3 font-quantico text-[32px] font-bold leading-none text-black disabled:opacity-50";

  const handleAnswer = (idx: number) => {
    if (isSubmitted) return;
    setSelectedChoiceIdx(idx);
  };

  const handleSubmit = () => {
    if (isSubmitted) return;
    if (selectedChoiceIdx === null) return;

    const isCorrect =
      selectedChoiceIdx === roundQuestions[currQuestionIdx].answerIdx;
    const correctLetter = ["A", "B", "C", "D"][
      roundQuestions[currQuestionIdx].answerIdx
    ];

    setSpeechText(
      isCorrect
        ? "Great job!"
        : `Nice try! The correct answer was ${correctLetter}.`,
    );

    if (isCorrect) {
      setShowXpPopup(true);
      if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
      xpTimerRef.current = setTimeout(() => setShowXpPopup(false), 1200);

      // If last question and correct, process win with rewards
      if (isLastQuestion) {
        handleGameWin();
        setIsSubmitted(true);
        return;
      }
    }

    if (isLastQuestion) {
      setGameState(GameState.WON);
      setSpeechText("That was fun! I loved playing with you!");
    } else {
      setSpeechText(
        isCorrect
          ? "Great job!"
          : `Nice try! The correct answer was ${correctLetter}.`,
      );

      if (isCorrect) {
        setShowXpPopup(true);
        if (xpTimerRef.current) clearTimeout(xpTimerRef.current);
        xpTimerRef.current = setTimeout(() => setShowXpPopup(false), 1200);
      }
    }

    setIsSubmitted(true);
  };

  const handleGameWin = async () => {
    if (!userId || isProcessingWin) return;

    setIsProcessingWin(true);
    setWinRewardDetails?.(null);

    try {
      const stats = await GameStatsHTTPClient.getGameStats(userId);
      const streakInDays = stats.streakInDays;
      const coinsAlreadyEarned = stats.coinsEarnedToday;

      const coinsToPay = GameRewardsService.calculateGameCoins(streakInDays);
      const actualCoinsEarned = GameRewardsService.getActualCoinsToEarn(
        coinsToPay,
        coinsAlreadyEarned,
      );

      await GameStatsHTTPClient.recordGameWin(
        userId,
        "trivia",
        actualCoinsEarned,
      );

      setShowCongratsPopup(true);
      if (congratsTimerRef.current) clearTimeout(congratsTimerRef.current);
      congratsTimerRef.current = setTimeout(
        () => setShowCongratsPopup(false),
        5000,
      );

      setGameState(GameState.WON);

      const updatedDailyCoins = Math.min(
        coinsAlreadyEarned + actualCoinsEarned,
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
    setIsSubmitted(false);
    setSelectedChoiceIdx(null);
    setShowXpPopup(false);

    const nextQuestionIdx = currQuestionIdx + 1;
    setCurrQuestionIdx(nextQuestionIdx);
    setSpeechText(roundQuestions[nextQuestionIdx].prompt);
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        {gameState === GameState.PLAYING && roundQuestions.length > 0 && (
          <>
            {showXpPopup && (
              <img
                src="/games/trivia/Notification.svg"
                alt="Correct XP +10"
                className="pointer-events-none fixed left-[54%] top-[16%] z-50 w-[110px] animate-xpFloat"
                draggable={false}
                style={{ imageRendering: "pixelated" }}
              />
            )}
            <div className="mt-8 flex flex-col items-center">
              <QuestionCard
                question={roundQuestions[currQuestionIdx]}
                onAnswer={handleAnswer}
                isAnswered={isSubmitted}
                selectedChoiceIdx={selectedChoiceIdx}
                currentQuestionNumber={currQuestionIdx + 1}
              />
            </div>

            <button
              type="button"
              onClick={!isSubmitted ? handleSubmit : handleNextQuestion}
              disabled={!isSubmitted && selectedChoiceIdx === null}
              className={buttonClassName}
            >
              {!isSubmitted ? "Submit" : "Next"}
            </button>
          </>
        )}
        {gameState === GameState.WON && roundQuestions.length > 0 && (
          <>
            <div className="mt-8 flex flex-col items-center">
              <QuestionCard
                question={roundQuestions[currQuestionIdx]}
                onAnswer={() => {}}
                isAnswered={true}
                selectedChoiceIdx={selectedChoiceIdx}
                currentQuestionNumber={currQuestionIdx + 1}
              />
            </div>

            <button
              type="button"
              onClick={handlePlayAgain}
              className={buttonClassName}
            >
              Play Again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
