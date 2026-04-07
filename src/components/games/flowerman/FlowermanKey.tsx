"use client";

import Image from "next/image";

type KeyState = "base" | "green" | "red";

const BUTTON_SRC: Record<KeyState, string> = {
  base: "/games/flowerman/keyboard/button_base.svg",
  green: "/games/flowerman/keyboard/button_green.svg",
  red: "/games/flowerman/keyboard/button_red.svg",
};

export default function FlowermanKey({
  letter,
  state,
  disabled,
  onPress,
  isMobile = false,
}: {
  letter: string;
  state: KeyState;
  disabled: boolean;
  onPress: () => void;
  isMobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className={`relative disabled:pointer-events-none touch-manipulation ${isMobile ? "aspect-square w-full" : "flex-1 h-full"}`}
      aria-label={`Key ${letter}`}
    >
      <Image
        src={BUTTON_SRC[state]}
        alt=""
        fill
        className="object-contain pointer-events-none"
      />
      <span
        className={`absolute inset-0 flex items-center justify-center font-quantico text-textBeige font-bold ${isMobile ? "text-base" : "text-3xl"}`}
      >
        {letter}
      </span>
    </button>
  );
}
