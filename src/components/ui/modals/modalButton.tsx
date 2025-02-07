import { MouseEventHandler } from "react";

interface ButtonProps {
  children: string;
  type?: "default" | "danger" | "success";
  disabled?: boolean;
  action: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const typeBackgroundColors = {
  default: "bg-white text-black",
  danger: "bg-iCAN-error text-white",
  success: "bg-icanGreen-100 text-black",
};

export default function ModalButton({
  children,
  action,
  className,
  type = "default",
  disabled = false,
}: ButtonProps) {
  const color = typeBackgroundColors[type];

  return (
    <button
      onClick={action}
      disabled={disabled}
      className={`${disabled ? "opacity-0" : ""} font-belanosima font-semibold px-5 py-2 text-2xl ${color} ${className}`}
      type="button"
    >
      {children}
    </button>
  );
}
