"use client";

import Image from "next/image";

const BUTTON_BASE = "/games/flowerman/keyboard/button_base.svg";
const BUTTON_GREEN = "/games/flowerman/keyboard/button_green.svg";

export default function FlowermanLetterTile({
  letter,
  revealed,
}: {
  letter: string;
  revealed: boolean;
}) {
  return (
    <div
      className={`relative flex-1 max-w-[60px] aspect-[79/88] ${revealed ? "opacity-100" : "opacity-50"}`}
    >
      <Image
        src={revealed ? BUTTON_GREEN : BUTTON_BASE}
        alt=""
        fill
        className="object-contain pointer-events-none"
      />
      {revealed && (
        <span
          className="absolute inset-0 flex items-center justify-center font-quantico text-textBeige text-3xl font-bold uppercase"
          aria-hidden
        >
          {letter}
        </span>
      )}
    </div>
  );
}
