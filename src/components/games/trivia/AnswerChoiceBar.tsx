import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  let displayVariant = variant;

  if (!disabled && isHovered && variant === "default") {
    displayVariant = "hover";
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative block w-full scale-x-[1.06] cursor-pointer disabled:cursor-default ${className}`}
    >
      <img
        src={variantToSrc[displayVariant]}
        alt=""
        aria-hidden="true"
        className="block w-full h-auto"
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
        className="absolute flex items-center font-quantico text-black leading-none text-left"
        style={{
          left: "13.2%",
          right: "7.5%",
          top: "26%",
          bottom: "24%",
          fontSize: "clamp(14px, 1.45vw, 20px)",
        }}
      >
        {children}
      </div>
    </button>
  );
}
