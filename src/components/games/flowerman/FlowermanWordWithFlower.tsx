"use client";

import FlowermanLetterTile from "./FlowermanLetterTile";
import FlowermanFlower from "./FlowermanFlower";

export default function FlowermanWordWithFlower({
  word,
  guessedLetters,
  livesRemaining,
  isMobile = false,
}: {
  word: string;
  guessedLetters: Set<string>;
  livesRemaining: number;
  isMobile?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center w-full ${isMobile ? "gap-1" : "gap-3"}`}
    >
      <div
        className={`flex justify-center w-full ${isMobile ? "gap-1" : "gap-3"}`}
      >
        {word.split("").map((char, i) => (
          <FlowermanLetterTile
            key={`${char}-${i}`}
            letter={char}
            revealed={guessedLetters.has(char)}
            isMobile={isMobile}
          />
        ))}
      </div>
      <FlowermanFlower livesRemaining={livesRemaining} isMobile={isMobile} />
    </div>
  );
}
