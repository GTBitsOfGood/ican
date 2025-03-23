import { ReactNode } from "react";

interface FormTextProps {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export default function FormText({
  children,
  className,
  disabled = false,
}: FormTextProps) {
  return (
    <div
      className={`text-xl tablet:text-3xl font-bold ${disabled ? "opacity-40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
