"use client";

import Image from "next/image";

const BUTTON_BASE = "/games/flowerman/keyboard/button_base.svg";
const BUTTON_GREEN = "/games/flowerman/keyboard/button_green.svg";

export default function FlowermanLetterTile({
  letter,
  revealed,
  isMobile = false,
}: {
  letter: string;
  revealed: boolean;
  isMobile?: boolean;
}) {
  return (
    <div
      className={`relative flex-1 aspect-[79/88] ${isMobile ? "max-w-[40px]" : "max-w-[60px]"} ${revealed ? "opacity-100" : "opacity-50"}`}
    >
      <Image
        src={revealed ? BUTTON_GREEN : BUTTON_BASE}
        alt=""
        fill
        className="object-contain pointer-events-none"
      />
      {revealed && (
        <span
          className={`absolute inset-0 flex items-center justify-center font-quantico text-textBeige font-bold uppercase ${isMobile ? "text-lg" : "text-3xl"}`}
          aria-hidden
        >
          {letter}
        </span>
      )}
    </div>
  );
}
