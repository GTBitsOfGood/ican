import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import { triviaQuestions } from "@/lib/triviaQuestions";
import QuestionCard from "./QuestionCard";
import { TriviaQuestion } from "@/types/games";

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
}: GameWrapperControls) {
  const [currQuestionIdx, setCurrQuestionIdx] = useState<number>(0);
  const [roundQuestions, setRoundQuestions] = useState(() =>
    generateRoundQuestions(),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(
    null,
  );

  const isLastQuestion = currQuestionIdx === roundQuestions.length - 1;

  const [showXpPopup, setShowXpPopup] = useState(false);
  const [showCongratsPopup, setShowCongratsPopup] = useState(false);
  const hasAutoStartedRef = useRef(false);

  const handleStart = useCallback(() => {
    setSpeechText("Let's learn how to play!");

    showInformationModal({
      gameMode: "TRIVIA",
      title: "INSTRUCTIONS",
      message:
        "Your pet will ask you a series of questions.\nSelect the answer you think is right!\n\nGet 10 XP for each correct answer.",
      onClose: () => setGameState(GameState.PLAYING),
    });
  }, [setSpeechText, showInformationModal, setGameState]);

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

      setTimeout(() => {
        setShowXpPopup(false);
      }, 1200);
    }

    if (isLastQuestion) {
      setShowCongratsPopup(true);

      setTimeout(() => {
        setShowCongratsPopup(false);
      }, 5000);
    }

    setIsSubmitted(true);
  };

  const handlePlayAgain = () => {
    const newQuestions = generateRoundQuestions();
    setCurrQuestionIdx(0);
    setRoundQuestions(newQuestions);
    setIsSubmitted(false);
    setSelectedChoiceIdx(null);
    setShowXpPopup(false);
    setShowCongratsPopup(false);
    setSpeechText(newQuestions[0].prompt);
  };

  const handleNextQuestion = () => {
    setIsSubmitted(false);
    setSelectedChoiceIdx(null);
    setShowXpPopup(false);

    const nextQuestionIdx = currQuestionIdx + 1;

    if (nextQuestionIdx < roundQuestions.length) {
      setCurrQuestionIdx(nextQuestionIdx);
      setSpeechText(roundQuestions[nextQuestionIdx].prompt);
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        {gameState === GameState.PLAYING && (
          <>
            {showCongratsPopup && (
              <div
                className="fixed inset-0 z-[100] flex items-center justify-center"
                onClick={() => setShowCongratsPopup(false)}
              >
                <img
                  src="/assets/CongratulationsBackdrop.svg"
                  alt="Congratulations"
                  className="w-[420px] max-w-[80vw] h-auto"
                  draggable={false}
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
            )}
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
              onClick={
                !isSubmitted
                  ? handleSubmit
                  : isLastQuestion
                    ? handlePlayAgain
                    : handleNextQuestion
              }
              disabled={!isSubmitted && selectedChoiceIdx === null}
              className="fixed right-[6%] bottom-[18%] z-50 border-[3px] border-black bg-[#8FB14F] px-12 py-3 font-quantico text-[32px] font-bold leading-none text-black disabled:opacity-50"
            >
              {!isSubmitted ? "Submit" : isLastQuestion ? "Play Again" : "Next"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
