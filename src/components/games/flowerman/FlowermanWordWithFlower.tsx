"use client";

import FlowermanLetterTile from "./FlowermanLetterTile";
import FlowermanFlower from "./FlowermanFlower";

export default function FlowermanWordWithFlower({
  word,
  guessedLetters,
  livesRemaining,
}: {
  word: string;
  guessedLetters: Set<string>;
  livesRemaining: number;
}) {
  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex justify-center gap-3 w-full">
        {word.split("").map((char, i) => (
          <FlowermanLetterTile
            key={`${char}-${i}`}
            letter={char}
            revealed={guessedLetters.has(char)}
          />
        ))}
      </div>
      <FlowermanFlower livesRemaining={livesRemaining} />
    </div>
  );
}
