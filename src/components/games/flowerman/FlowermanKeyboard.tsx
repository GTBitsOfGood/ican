"use client";

import Image from "next/image";
import FlowermanKey from "./FlowermanKey";
import { ALPHABET } from "@/constant/flowermanConstants";

const ROW1 = ALPHABET.slice(0, 13); // A-M
const ROW2 = ALPHABET.slice(13, 26); // N-Z

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
}: {
  word: string;
  guessedLetters: Set<string>;
  disabled: boolean;
  onLetterGuess: (letter: string) => void;
}) {
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
