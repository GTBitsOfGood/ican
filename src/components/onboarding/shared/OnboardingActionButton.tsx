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
    <div className={`w-full flex justify-end ${className}`}>
      <button
        className={`px-5 py-2.5 transition-colors ${
          disabled
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-lime-200 hover:bg-gray-100"
        }`}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        type="button"
      >
        <div
          className={`text-3xl font-normal font-quantico ${
            disabled ? "text-gray-500" : "text-black/50"
          }`}
        >
          {text}
        </div>
      </button>
    </div>
  );
}
