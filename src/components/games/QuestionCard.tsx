import { TriviaQuestion } from "@/types/trivia";

interface QuestionCardProps {
  question: TriviaQuestion;
  onAnswer: (choiceIdx: number) => void;
  selectedChoiceIdx: number | null;
  isAnswered: boolean;
  onNext: () => void;
}

export default function QuestionCard({
  question,
  onAnswer,
  selectedChoiceIdx,
  isAnswered,
  onNext,
}: QuestionCardProps) {
  return (
    <div className="flex h-full min-h-[420px] w-full items-center justify-center rounded-2xl bg-white/50 px-6">
      <div className="text-center font-quantico text-icanBlue-300">
        <p className="text-3xl">{question.prompt}</p>
        <div className="grid grid-cols-2 gap-6 mt-8">
          {question.choices.map((option, idx) => {
            const buttonClass =
              "w-full rounded-xl border-4 px-4 py-4 text-base shadow-[0_4px_0_0_#7D83B2] transition sm:px-6 sm:text-lg";
            let colorClass = isAnswered
              ? "border-icanBlue-200 bg-white"
              : "border-icanBlue-200 bg-white hover:bg-icanBlue-200 hover:text-white cursor-pointer";

            if (isAnswered) {
              if (idx === question.answerIdx) {
                colorClass = "bg-green-100 border-green-600";
              } else if (idx === selectedChoiceIdx) {
                colorClass = "bg-red-100 border-red-600";
              }
            }

            return (
              <button
                key={idx}
                className={`${buttonClass} ${colorClass}`}
                onClick={() => onAnswer(idx)}
                disabled={isAnswered}
              >
                <span className="block break-words">{option}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className={`rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 text-sm text-icanBlue-300 shadow-[0_4px_0_0_#7D83B2] hover:bg-icanBlue-200 hover:text-white transition ${isAnswered ? "visible" : "invisible"}`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
