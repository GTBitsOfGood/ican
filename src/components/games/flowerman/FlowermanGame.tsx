import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import {
  getRandomWordWithHint,
  INSTRUCTIONS,
  LIVES as START_LIVES,
} from "@/constant/flowermanConstants";
import FlowermanWordWithFlower from "@/components/flowerman/FlowermanWordWithFlower";
import FlowermanKeyboard from "@/components/flowerman/FlowermanKeyboard";

export default function FlowermanGame({
  setSpeechText,
  gameState,
  setGameState,
  showInformationModal,
}: GameWrapperControls) {
  const [word, setWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState<number>(START_LIVES);
  const pendingHintRef = useRef<string>("");
  const pendingWordLengthRef = useRef<number>(0);
  const hasAutoStartedRef = useRef(false);

  const startNewWord = useCallback(() => {
    const { word: w, hint: h } = getRandomWordWithHint();
    setWord(w.toUpperCase());
    setGuessedLetters(new Set());
    setLives(START_LIVES);
    return { hint: h, wordLength: w.length };
  }, []);

  const handleStart = useCallback(() => {
    const { hint, wordLength } = startNewWord();
    pendingHintRef.current = hint;
    pendingWordLengthRef.current = wordLength;
    setSpeechText("Let's start! It’s your turn to guess a letter.");
    showInformationModal({
      gameMode: "FLOWERMAN",
      title: "INSTRUCTIONS",
      message: INSTRUCTIONS,
      onClose: () => {
        showInformationModal({
          gameMode: "FLOWERMAN",
          title: "HINT",
          message: pendingHintRef.current,
          letters: `${pendingWordLengthRef.current} LETTERS`,
          onClose: () => setGameState(GameState.PLAYING),
        });
      },
    });
  }, [startNewWord, showInformationModal, setSpeechText, setGameState]);

  // Show instruction card immediately when game loads
  useEffect(() => {
    if (gameState === GameState.START && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      handleStart();
    }
  }, [gameState, handleStart]);

  const handleRestart = () => {
    const { hint, wordLength } = startNewWord();
    setSpeechText("New word! It’s your turn to guess a letter.");
    setGameState(GameState.PLAYING);
    showInformationModal({
      gameMode: "FLOWERMAN",
      title: "HINT",
      message: hint,
      letters: `${wordLength} LETTERS`,
    });
  };

  const handleLetterGuess = (letter: string) => {
    if (gameState !== GameState.PLAYING || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (word.includes(letter)) {
      const isWon = [...word].every((char) => newGuessed.has(char));
      if (isWon) {
        setGameState(GameState.WON);
        setSpeechText(`Congratulations! You won!`);
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

  return (
    <>
      <div className="flex h-full flex-col items-center justify-center py-2">
        <FlowermanWordWithFlower
          word={word}
          guessedLetters={guessedLetters}
          livesRemaining={lives}
        />
      </div>

      {/* Restart button — always visible, fixed above the leave-game button */}
      <button
        type="button"
        onClick={handleRestart}
        className="fixed bottom-24 right-6 z-[67] flex items-center justify-center"
        aria-label="Restart game"
      >
        <img
          src="/games/flowerman/restart.svg"
          alt=""
          className="h-14 w-auto"
        />
      </button>

      {/* Keyboard — fixed across the full bottom of the screen; disabled until playing */}
      <div className="fixed bottom-0 left-0 right-0 px-6 pb-4">
        <FlowermanKeyboard
          word={word}
          guessedLetters={guessedLetters}
          disabled={gameState !== GameState.PLAYING}
          onLetterGuess={handleLetterGuess}
        />
      </div>
    </>
  );
}
