"use client";

import Image from "next/image";
import FlowermanKey from "./FlowermanKey";
import { ALPHABET } from "@/constant/flowermanConstants";

const DESKTOP_ROWS = [ALPHABET.slice(0, 13), ALPHABET.slice(13, 26)];
const MOBILE_ROWS = [
  ALPHABET.slice(0, 7),
  ALPHABET.slice(7, 14),
  ALPHABET.slice(14, 21),
  ALPHABET.slice(21, 26),
];

type KeyState = "base" | "green" | "red";

function getKeyState(
  letter: string,
  word: string,
  guessedLetters: Set<string>,
): KeyState {
  if (!guessedLetters.has(letter)) return "base";
  return word.includes(letter) ? "green" : "red";
}

export default function FlowermanKeyboard({
  word,
  guessedLetters,
  disabled,
  onLetterGuess,
  isMobile = false,
}: {
  word: string;
  guessedLetters: Set<string>;
  disabled: boolean;
  onLetterGuess: (letter: string) => void;
  isMobile?: boolean;
}) {
  if (isMobile) {
    return (
      <div className="bg-[#F5F0E8] rounded-md p-4 mx-auto w-fit flex flex-col gap-1.5">
        {MOBILE_ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1 justify-center">
            {row.map((letter) => (
              <FlowermanKey
                key={letter}
                letter={letter}
                state={getKeyState(letter, word, guessedLetters)}
                disabled={disabled || guessedLetters.has(letter)}
                onPress={() => onLetterGuess(letter)}
                isMobile
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[870px] max-w-[70%] overflow-hidden">
      <Image
        src="/games/flowerman/keyboard/keyboard.svg"
        alt=""
        width={1415}
        height={282}
        className="w-full h-auto pointer-events-none"
      />
      <div className="absolute inset-0 flex flex-col px-[3%] py-[2%] gap-[5%]">
        <div className="flex flex-1 gap-[1%]">
          {DESKTOP_ROWS[0].map((letter) => (
            <FlowermanKey
              key={letter}
              letter={letter}
              state={getKeyState(letter, word, guessedLetters)}
              disabled={disabled || guessedLetters.has(letter)}
              onPress={() => onLetterGuess(letter)}
            />
          ))}
        </div>
        <div className="flex flex-1 gap-[1%]">
          {DESKTOP_ROWS[1].map((letter) => (
            <FlowermanKey
              key={letter}
              letter={letter}
              state={getKeyState(letter, word, guessedLetters)}
              disabled={disabled || guessedLetters.has(letter)}
              onPress={() => onLetterGuess(letter)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
