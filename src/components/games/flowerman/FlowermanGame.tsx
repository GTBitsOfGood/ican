import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import {
  getRandomWordWithHint,
  INSTRUCTIONS,
  LIVES as START_LIVES,
} from "@/constant/flowermanConstants";
import FlowermanWordWithFlower from "@/components/games/flowerman/FlowermanWordWithFlower";
import FlowermanKeyboard from "@/components/games/flowerman/FlowermanKeyboard";
import MistakesLeft from "@/components/games/flowerman/MistakesLeft";
import { PetEmotion } from "@/types/pet";
import { useUser } from "@/components/UserContext";
import {
  useGameStatistics,
  useRecordGameResult,
} from "@/components/hooks/useGameStatistics";
import { GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";
import { GameName, GameResult } from "@/types/games";

export default function FlowermanGame({
  setSpeechText,
  gameState,
  setGameState,
  showInformationModal,
  setPetBoardX,
  setPetEmotion,
  setWinRewardDetails,
}: GameWrapperControls) {
  const { userId } = useUser();
  const { data: gameStatistics } = useGameStatistics(userId);
  const recordGameResult = useRecordGameResult();
  const [word, setWord] = useState<string>("");
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState<number>(START_LIVES);
  const [isProcessingWin, setIsProcessingWin] = useState(false);
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

  useEffect(() => {
    if (gameState === GameState.START && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true;
      queueMicrotask(() => handleStart());
    }
  }, [gameState, handleStart]);

  const writingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerWriting = useCallback(() => {
    if (!setPetBoardX || !setPetEmotion) return;

    if (writingTimeoutRef.current) {
      clearTimeout(writingTimeoutRef.current);
    }

    setPetBoardX(-55);
    setPetEmotion(PetEmotion.WRITING);

    writingTimeoutRef.current = setTimeout(() => {
      setPetBoardX(null);
      setPetEmotion(null);
    }, 1500);
  }, [setPetBoardX, setPetEmotion]);

  useEffect(() => {
    return () => {
      if (writingTimeoutRef.current) {
        clearTimeout(writingTimeoutRef.current);
      }
    };
  }, []);

  const handleRestart = () => {
    const { hint, wordLength } = startNewWord();
    setSpeechText("New word! It's your turn to guess a letter.");
    showInformationModal({
      gameMode: "FLOWERMAN",
      title: "HINT",
      message: hint,
      letters: `${wordLength} LETTERS`,
      onClose: () => setGameState(GameState.PLAYING),
    });
  };

  const handleGameWin = async () => {
    if (!userId || isProcessingWin) return;

    setIsProcessingWin(true);
    setWinRewardDetails?.(null);

    try {
      const coinsAlreadyEarned = gameStatistics?.coinsEarnedToday ?? 0;
      const stats = await recordGameResult.mutateAsync({
        userId,
        gameName: GameName.HANGMAN,
        result: GameResult.WIN,
      });
      const actualCoinsEarned = Math.max(
        0,
        stats.coinsEarnedToday - coinsAlreadyEarned,
      );

      const updatedDailyCoins = Math.min(
        stats.coinsEarnedToday,
        GAMES_DAILY_COIN_LIMIT,
      );

      setWinRewardDetails?.({
        coinsEarned: actualCoinsEarned,
        dailyCoinsTotal: updatedDailyCoins,
        maxCoinsPerDay: GAMES_DAILY_COIN_LIMIT,
        maxReached: actualCoinsEarned === 0,
      });

      setGameState(GameState.WON);
    } catch (error) {
      console.error("Error processing game win:", error);
      setWinRewardDetails?.(null);
      showInformationModal({
        title: "YOU WIN!",
        message: "Congratulations! You won!",
        onClose: () => {
          setGameState(GameState.WON);
        },
      });
    } finally {
      setIsProcessingWin(false);
    }
  };

  const handleLetterGuess = (letter: string) => {
    if (gameState !== GameState.PLAYING || guessedLetters.has(letter)) return;

    const newGuessed = new Set(guessedLetters).add(letter);
    setGuessedLetters(newGuessed);

    if (word.includes(letter)) {
      const isWon = [...word].every((char) => newGuessed.has(char));
      if (isWon) {
        setSpeechText(`Congratulations! You won!`);
        handleGameWin();
      } else {
        setSpeechText(`Nice guess! ${letter} is in the word.`);
      }
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      triggerWriting();
      if (newLives === 0) {
        if (userId) {
          void recordGameResult.mutateAsync({
            userId,
            gameName: GameName.HANGMAN,
            result: GameResult.LOSS,
          });
        }
        setGameState(GameState.LOSS);
        setSpeechText(`Game over! The word was "${word}".`);
      } else {
        setSpeechText(`Try again. ${letter} is not in the word.`);
      }
    }
  };

  return (
    <>
      {/* Mistakes left — top left, to the right of the profile header; z below modal (60) so it greys out with overlay */}
      <div className="fixed top-[100px] left-[90px] z-[50]">
        <MistakesLeft count={lives} />
      </div>

      <div className="flex h-full flex-col items-center justify-center mt-8">
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
        className="fixed top-[95px] right-[5px] z-[67] flex items-center justify-center"
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
