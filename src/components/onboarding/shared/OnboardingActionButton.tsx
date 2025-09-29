interface OnboardingActionButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function OnboardingActionButton({
  text,
  onClick,
  disabled = false,
  className = "",
}: OnboardingActionButtonProps) {
  return (
    <div
      className={`w-full flex justify-center desktop:justify-end ${className}`}
    >
      <button
        className={`w-full desktop:w-auto px-5 py-2.5 transition-colors ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-icanGreen-300 hover:bg-gray-100"
        }`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        type="button"
      >
        <div
          className={`text-lg desktop:text-3xl font-normal font-quantico ${
            disabled ? "text-gray-500" : "text-black/50"
          }`}
        >
          {text}
        </div>
      </button>
    </div>
  );
}
