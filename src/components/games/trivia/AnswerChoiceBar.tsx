interface AnswerChoiceBarProps {
  letter: string;
  children: React.ReactNode;
  variant?: "default" | "hover" | "selected" | "correct" | "wrong";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const variantToSrc = {
  default: "/games/trivia/UnselectedAnswerChoice.svg",
  hover: "/games/trivia/HoverAnswerChoice.svg",
  selected: "/games/trivia/SelectedAnswerChoice.svg",
  correct: "/games/trivia/CorrectAnswerChoice.svg",
  wrong: "/games/trivia/WrongAnswerChoice.svg",
};

export default function AnswerChoiceBar({
  letter,
  children,
  variant = "default",
  onClick,
  disabled,
  className = "",
}: AnswerChoiceBarProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`relative block w-full scale-x-[1.06] cursor-pointer transition-[filter] hover:brightness-[0.98] hover:drop-shadow-[0_5px_5px_rgba(0,0,0,0.2)] disabled:cursor-default disabled:hover:brightness-100 disabled:hover:drop-shadow-none ${className}`}
    >
      <img
        src={variantToSrc[variant]}
        alt=""
        aria-hidden="true"
        className="block h-auto w-full"
        draggable={false}
      />

      {/* Letter */}
      <div
        className="absolute pointer-events-none flex items-center justify-center"
        style={{
          left: "0.3%",
          top: "20%",
          width: "11.5%",
          height: "64%",
        }}
      >
        <span
          className="font-quantico font-bold leading-none text-white"
          style={{
            fontSize: "clamp(22px, 2.4vw, 34px)",
            transform: "translateY(-2px)",
          }}
        >
          {letter}
        </span>
      </div>

      {/* Answer text */}
      <div
        className="absolute flex items-center font-quantico text-black leading-none text-left overflow-hidden"
        style={{
          left: "13.2%",
          right: "7.5%",
          top: "26%",
          bottom: "24%",
          fontSize: "clamp(8px, 3.2vw, 20px)",
          whiteSpace: "nowrap",
        }}
      >
        {children}
      </div>
    </button>
  );
}
