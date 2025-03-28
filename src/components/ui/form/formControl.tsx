import { ReactNode } from "react";

interface FormControlProps {
  children: ReactNode;
  mobileColumn?: boolean;
  gap?: number;
}

export default function FormControl({
  children,
  gap,
  mobileColumn,
}: FormControlProps) {
  return (
    <div
      className={`${mobileColumn ? "gap-4 smallTablet:flex-row flex-col" : "justify-start items-center gap-12"} flex smallTablet:justify-start smallTablet:items-center smallTablet:gap-12 `}
      style={gap ? { gap: gap } : {}}
    >
      {children}
    </div>
  );
}
