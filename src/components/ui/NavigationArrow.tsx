interface NavigationArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  ariaLabel: string;
  disabled?: boolean;
}

export default function NavigationArrow({
  direction,
  onClick,
  ariaLabel,
  disabled = false,
}: NavigationArrowProps) {
  if (disabled) return null;

  const path = direction === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6";

  return (
    <button
      onClick={onClick}
      className={`absolute ${direction === "left" ? "left-0" : "right-0"} z-10 hover:opacity-80 transition-opacity`}
      style={{ filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3))" }}
      aria-label={ariaLabel}
    >
      <svg
        width="80"
        height="80"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={path} className="fill-loginGreen" />
      </svg>
    </button>
  );
}
