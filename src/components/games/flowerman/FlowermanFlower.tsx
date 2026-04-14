"use client";

import Image from "next/image";
import { LIVES } from "@/constant/flowermanConstants";

export default function FlowermanFlower({
  livesRemaining,
  isMobile = false,
}: {
  livesRemaining: number;
  isMobile?: boolean;
}) {
  const index = Math.min(9, Math.max(1, 9 - livesRemaining));
  const src = `/games/flowerman/flower/${index}.svg`;
  const showFlower = livesRemaining < LIVES;

  return (
    <div
      className={`relative w-full aspect-square mx-auto overflow-hidden ${isMobile ? "max-w-[160px]" : "max-w-[350px]"}`}
    >
      <Image
        src="/games/flowerman/flower/9.svg"
        alt=""
        width={520}
        height={520}
        className="absolute inset-0 w-full h-full object-contain scale-[1.43] opacity-25 pointer-events-none"
      />
      {showFlower ? (
        <Image
          src={src}
          alt=""
          width={520}
          height={520}
          className="relative z-10 w-full h-full object-contain scale-[1.43]"
        />
      ) : null}
    </div>
  );
}
