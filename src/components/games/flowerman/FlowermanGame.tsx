import { useEffect, useState, useCallback, useRef } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import { cn } from "@/lib/utils";
import {
  WORDS,
  LIVES as START_LIVES,
  ALPHABET,
} from "@/constant/flowermanConstants";

export default function FlowermanGame({
  setSpeechText,
  gameState,
  setGameState,
}: GameWrapperControls) {
  const [word, setWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState<number>(0);

  const initGame = useCallback(() => {
    const newWord =
      WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
    setWord(newWord);
    setGuessedLetters(new Set());
    setLives(START_LIVES);
    setSpeechText(`Guess the word! You have ${START_LIVES} lives.`);
  }, [setSpeechText]);

  // Reset only when user clicks "Play Again" (transition from WON/LOSS → PLAYING)
  const prevGameStateRef = useRef(gameState);
  useEffect(() => {
    const prev = prevGameStateRef.current;
    prevGameStateRef.current = gameState;
    if (
      (prev === GameState.WON || prev === GameState.LOSS) &&
      gameState === GameState.PLAYING
    ) {
      initGame();
    }
  }, [gameState, initGame]);

  const handleStart = () => {
    initGame();
    setGameState(GameState.PLAYING);
  };

  const handleLetterGuess = (letter: string) => {
    if (gameState !== GameState.PLAYING || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (word.includes(letter)) {
      const isWon = [...word].every((char) => newGuessed.has(char));
      if (isWon) {
        setGameState(GameState.WON);
        setSpeechText(`Congratulations! The word was "${word}".`);
      } else {
        setSpeechText(`Nice guess! ${letter} is in the word.`);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameState(GameState.LOSS);
        setSpeechText(`Game over! The word was "${word}".`);
      } else {
        setSpeechText(`Try again. ${letter} is not in the word.`);
      }
    }
  };

  // UI: START State
  if (gameState === GameState.START) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-icanBlue-300 font-quantico">
        <h2 className="text-3xl mb-8">Flowerman</h2>
        <button
          onClick={handleStart}
          className="rounded-xl border-4 border-icanBlue-200 bg-white px-8 py-4 shadow-[0_4px_0_0_#7D83B2] hover:bg-icanBlue-50 font-quantico text-xl"
        >
          Play
        </button>
      </div>
    );
  }

  // UI: PLAYING/WON/LOSS State
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center py-2">
      <div className="mb-4 flex flex-col items-center gap-2">
        <div className="flex flex-wrap justify-center gap-2 text-4xl font-bold font-quantico text-icanBlue-300 tracking-widest">
          {word.split("").map((char, i) => (
            <span
              key={i}
              className="w-8 text-center border-b-4 border-icanBlue-100"
            >
              {guessedLetters.has(char) ? char : ""}
            </span>
          ))}
        </div>
        <div className="text-2xl font-quantico text-icanBlue-300 justify-center">
          Guesses remaining: <span className="text-red-500">{lives}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {ALPHABET.map((letter) => {
          const isGuessed = guessedLetters.has(letter);
          const isCorrect = isGuessed && word.includes(letter);

          return (
            <button
              key={letter}
              onClick={() => handleLetterGuess(letter)}
              disabled={isGuessed || gameState !== GameState.PLAYING}
              className={cn(
                "w-10 h-12 rounded-xl border-4 border-icanBlue-200 font-quantico transition-all shadow-[0_4px_0_0_#7D83B2]",
                isGuessed && isCorrect
                  ? "bg-icanGreen-300 text-white"
                  : isGuessed
                    ? "bg-gray-100 text-gray-400 shadow-none translate-y-1"
                    : "bg-white text-icanBlue-300 hover:bg-icanBlue-50",
              )}
            >
              {letter}
            </button>
          );
        })}
      </div>
    </div>
  );
}
