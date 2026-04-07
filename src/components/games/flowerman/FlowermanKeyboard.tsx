"use client";

import Image from "next/image";
import FlowermanKey from "./FlowermanKey";
import { ALPHABET } from "@/constant/flowermanConstants";

const ROW1 = ALPHABET.slice(0, 13); // A-M
const ROW2 = ALPHABET.slice(13, 26); // N-Z

// Mobile rows: 7-7-7-5
const MOBILE_ROW1 = ALPHABET.slice(0, 7); // A-G
const MOBILE_ROW2 = ALPHABET.slice(7, 14); // H-N
const MOBILE_ROW3 = ALPHABET.slice(14, 21); // O-U
const MOBILE_ROW4 = ALPHABET.slice(21, 26); // V-Z

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
        {[MOBILE_ROW1, MOBILE_ROW2, MOBILE_ROW3, MOBILE_ROW4].map((row, ri) => (
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
          {ROW1.map((letter) => (
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
          {ROW2.map((letter) => (
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
