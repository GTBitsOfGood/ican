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
      className={`w-[90%] max-w-sm px-5 py-6 gap-2 rounded-lg backdrop-blur-[2px] desktop:max-w-4xl desktop:w-full desktop:px-12 desktop:py-14 desktop:gap-12 desktop:rounded-[15px] desktop:backdrop-blur-[5px] bg-[#4C539B]/80 flex flex-col overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}
