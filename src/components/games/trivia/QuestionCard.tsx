import { TriviaQuestion } from "@/types/games";
import AnswerChoiceBar from "./AnswerChoiceBar";

interface QuestionCardProps {
  question: TriviaQuestion;
  onAnswer: (choiceIdx: number) => void;
  selectedChoiceIdx: number | null;
  isAnswered: boolean;
  currentQuestionNumber: number;
}

const LETTERS = ["A", "B", "C", "D"];

export default function QuestionCard({
  question,
  onAnswer,
  selectedChoiceIdx,
  isAnswered,
  currentQuestionNumber,
}: QuestionCardProps) {
  return (
    <div className="flex h-full w-full flex-col px-1 wideGame:px-2 pb-1 wideGame:pb-2">
      <div className="mb-2 wideGame:mb-8 flex flex-col items-center">
        <div className="font-quantico text-xs wideGame:text-[22px] font-bold leading-none text-black">
          {currentQuestionNumber} of 5
        </div>

        <div className="mt-1 wideGame:mt-3 flex items-center gap-1 wideGame:gap-2">
          {[0, 1, 2, 3, 4].map((idx) => {
            const isActive = idx === currentQuestionNumber - 1;

            return (
              <div
                key={idx}
                className={`h-2 w-2 wideGame:h-3 wideGame:w-3 rounded-full border border-black ${
                  isActive ? "bg-icanGreen-300" : "bg-white"
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 wideGame:gap-5">
        {question.choices.map((option, idx) => {
          let variant: "default" | "hover" | "selected" | "correct" | "wrong" =
            "default";

          if (isAnswered) {
            if (idx === question.answerIdx) {
              variant = "correct";
            } else if (idx === selectedChoiceIdx) {
              variant = "wrong";
            }
          } else if (idx === selectedChoiceIdx) {
            variant = "selected";
          }

          return (
            <AnswerChoiceBar
              key={idx}
              letter={LETTERS[idx]}
              variant={variant}
              onClick={() => onAnswer(idx)}
              disabled={isAnswered}
            >
              {option}
            </AnswerChoiceBar>
          );
        })}
      </div>
    </div>
  );
}
