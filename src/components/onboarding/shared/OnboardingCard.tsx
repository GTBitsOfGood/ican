import { ReactNode } from "react";

interface OnboardingCardProps {
  children: ReactNode;
  className?: string;
}

export default function OnboardingCard({
  children,
  className = "",
}: OnboardingCardProps) {
  return (
    <div
      className={`px-12 py-14 w-[998px] bg-[#4C539B]/80 rounded-[15px] backdrop-blur-[5px] flex flex-col gap-12 overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
