import { useEffect, useState, useCallback } from "react";
import { GameState, type GameWrapperControls } from "./GameWrapper";
import { cn } from "@/lib/utils";

const WORDS = [
  "Apple",
  "Astronaut",
  "Balloon",
  "Butterfly",
  "Caterpillar",
  "Cloud",
  "Diamond",
  "Dragon",
  "Eagle",
  "Elephant",
  "Firefighter",
  "Frog",
  "Garden",
  "Gorilla",
  "Helicopter",
  "Hospital",
  "Igloo",
  "Insect",
  "Jacket",
  "Jellyfish",
  "Kangaroo",
  "Kite",
  "Lemon",
  "Lighthouse",
  "Monkey",
  "Moon",
  "Nest",
  "Notebook",
  "Octopus",
  "Owl",
  "Penguin",
  "Pirate",
  "Queen",
  "Rainbow",
  "Robot",
  "Spider",
  "Sun",
  "Tiger",
  "Train",
  "Umbrella",
  "Unicorn",
  "Violin",
  "Volcano",
  "Wagon",
  "Whale",
  "Xylophone",
  "Yacht",
  "Yarn",
  "Zipper",
  "Zoo",
];
const DIFFICULTY_LIVES = { easy: 12, medium: 10, hard: 7 };
type Difficulty = "easy" | "medium" | "hard";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function HangmanGame({
  setSpeechText,
  gameState,
  setGameState,
}: GameWrapperControls) {
  const [word, setWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState<number>(0);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");

  // 1. Unified Reset Logic
  const initGame = useCallback(
    (selectedDiff: Difficulty = difficulty) => {
      const newWord =
        WORDS[Math.floor(Math.random() * WORDS.length)].toUpperCase();
      const startLives = DIFFICULTY_LIVES[selectedDiff];

      setWord(newWord);
      setGuessedLetters(new Set());
      setLives(startLives);
      setSpeechText(`Guess the word! You have ${startLives} lives.`);
    },
    [difficulty, setSpeechText],
  );

  // 2. Watch for "Play Again" from GameWrapper
  useEffect(() => {
    // Check if we need to reset:
    // 1. No word exists (initial start)
    // 2. We lost (lives === 0)
    // 3. We won (all letters in current word are already in guessedLetters)
    const isGameWon =
      word !== "" && [...word].every((char) => guessedLetters.has(char));

    if (word === "" || lives === 0 || isGameWon) {
      initGame();
    }
  }, [gameState, word, lives, initGame]);

  const handleDifficultySelect = (selected: Difficulty) => {
    setDifficulty(selected);
    initGame(selected);
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
        <h2 className="text-3xl mb-8">Hangman</h2>
        <div className="flex gap-4">
          {(["easy", "medium", "hard"] as Difficulty[]).map((diff) => (
            <button
              key={diff}
              onClick={() => handleDifficultySelect(diff)}
              className="rounded-xl border-4 border-icanBlue-200 bg-white px-6 py-3 shadow-[0_4px_0_0_#7D83B2] hover:bg-icanBlue-50 capitalize"
            >
              {diff}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // UI: PLAYING/WON/LOSS State
  return (
    <div className="flex min-h-full h-full flex-col items-center  py-8">
      <div className="mb-12 flex items-center gap-10">
        <div className="flex gap-3 text-4xl font-bold font-quantico text-icanBlue-300 tracking-widest">
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

      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
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
