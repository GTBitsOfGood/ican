import { useEffect, useState } from "react";
import { GameState, type GameWrapperControls } from "./GameWrapper";
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
}: GameWrapperControls) {
  const [currQuestionIdx, setCurrQuestionIdx] = useState<number>(0);
  const [roundQuestions, setRoundQuestions] = useState(() =>
    generateRoundQuestions(),
  );
  const [results, setResults] = useState<boolean[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedChoiceIdx, setSelectedChoiceIdx] = useState<number | null>(
    null,
  );

  const countCorrect = results.filter(Boolean).length;
  const countIncorrect = results.length - countCorrect;

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      setCurrQuestionIdx(0);
      setResults([]);
      setRoundQuestions(generateRoundQuestions());
      setIsAnswered(false);
      setSelectedChoiceIdx(null);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Press start to begin!");
      return;
    }
    if (gameState === GameState.PLAYING) {
      setSpeechText("Choose wisely!");
      return;
    }
    if (gameState === GameState.WON) {
      setSpeechText("Amazing! You have won!");
      return;
    }
    setSpeechText("Nice try!");
  }, [gameState, setSpeechText]);

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;

    const isCorrect = idx === roundQuestions[currQuestionIdx].answerIdx;

    setResults((prev) => {
      const next = [...prev, isCorrect];

      // decide win/loss if last question
      const isLastQuestion = currQuestionIdx + 1 >= roundQuestions.length;
      if (isLastQuestion) {
        const finalCorrect = next.filter(Boolean).length;
        if (finalCorrect < 0.8 * roundQuestions.length) {
          setGameState(GameState.LOSS);
        } else {
          setGameState(GameState.WON);
        }
      }

      return next;
    });

    setSelectedChoiceIdx(idx);
    setSpeechText(
      isCorrect ? "Great job!" : roundQuestions[currQuestionIdx].explanation,
    );
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedChoiceIdx(null);
    setSpeechText("Choose wisely!");

    const nextQuestionIdx = currQuestionIdx + 1;

    if (nextQuestionIdx < roundQuestions.length) {
      setCurrQuestionIdx(nextQuestionIdx);
    }
  };

  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-2xl bg-white/50 px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        {/* Start screen */}
        {gameState === GameState.START && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setGameState(GameState.PLAYING)}
              className="rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 shadow-[0_4px_0_0_#7D83B2]"
            >
              Start
            </button>
          </div>
        )}

        {/* Playing game */}
        {gameState === GameState.PLAYING && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <QuestionCard
              question={roundQuestions[currQuestionIdx]}
              onAnswer={handleAnswer}
              isAnswered={isAnswered}
              selectedChoiceIdx={selectedChoiceIdx}
              onNext={handleNextQuestion}
            />
            <p>
              Progress: {results.length}/{roundQuestions.length} Correct:{" "}
              <span className="text-green-600">{countCorrect}</span> Incorrect:{" "}
              <span className="text-red-600">{countIncorrect}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
