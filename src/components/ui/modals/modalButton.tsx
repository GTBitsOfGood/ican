import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  type?: "default" | "danger" | "success";
  disabled?: boolean;
  action: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

const typeBackgroundColors = {
  default: "bg-white text-black",
  danger: "bg-errorRed text-white",
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
      className={`${className} ${disabled ? "opacity-0" : ""} font-belanosima px-3 tablet:px-5 py-2 text-xl tablet:text-3xl ${color}`}
      type="button"
    >
      {children}
    </button>
  );
}
