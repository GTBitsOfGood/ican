import { ReactNode } from "react";

interface FormControlProps {
  children: ReactNode;
  gap?: number;
}

export default function FormControl({ children, gap }: FormControlProps) {
  return (
    <div
      className="flex justify-start items-center gap-12"
      style={{ gap: gap || 48 }}
    >
      {children}
    </div>
  );
}
