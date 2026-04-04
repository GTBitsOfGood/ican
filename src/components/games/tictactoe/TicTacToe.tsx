import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";
import { useUser } from "@/components/UserContext";
import { useUserProfile } from "@/components/hooks/useAuth";
import {
  useGameStatistics,
  useRecordGameResult,
} from "@/components/hooks/useGameStatistics";
import { GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";
import { GameName, GameResult } from "@/types/games";
import {
  calculateWinner,
  makeAIMove,
  type Board,
  type Difficulty,
} from "./tictactoeAI";

export default function TicTacToe({
  setSpeechText,
  gameState,
  setGameState,
  showInformationModal,
  setWinRewardDetails,
}: GameWrapperControls) {
  const { userId } = useUser();
  const { data: userProfile } = useUserProfile(userId);
  const { data: gameStatistics } = useGameStatistics(userId);
  const recordGameResult = useRecordGameResult();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const prevGameStateRef = useRef<GameState>(gameState);
  const hasShownInitialPlayingMessageRef = useRef(false);
  const hasShownInstructionsRef = useRef(false);
  const aiMoveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isProcessingWin, setIsProcessingWin] = useState(false);

  const handleStart = useCallback(() => {
    setGameState(GameState.PLAYING);
  }, [setGameState]);

  const showInstructions = useCallback(() => {
    showInformationModal({
      gameMode: "TIC-TAC-TOE",
      title: "INSTRUCTIONS",
      message:
        "Press a space on the board to place your tile. You and your pet will take turns placing tiles. Get three X's in a row to win!",
      onClose: () => undefined,
    });
  }, [showInformationModal]);

  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Welcome!");
      hasShownInitialPlayingMessageRef.current = false;
      if (!hasShownInstructionsRef.current) {
        hasShownInstructionsRef.current = true;
        showInstructions();
      }
    }
  }, [gameState, setSpeechText, showInstructions]);

  useEffect(() => {
    return () => {
      if (aiMoveTimeoutRef.current) {
        clearTimeout(aiMoveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameState !== GameState.PLAYING && aiMoveTimeoutRef.current) {
      clearTimeout(aiMoveTimeoutRef.current);
      aiMoveTimeoutRef.current = null;
    }
  }, [gameState]);

  useEffect(() => {
    const prev = prevGameStateRef.current;
    prevGameStateRef.current = gameState;
    if (
      gameState === GameState.PLAYING &&
      (prev === GameState.WON ||
        prev === GameState.LOSS ||
        prev === GameState.TIE)
    ) {
      setBoard(Array(9).fill(null));
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Yay lets start! It’s your turn first.");
      return;
    }
    if (gameState === GameState.PLAYING) {
      if (aiIsThinking) {
        setSpeechText("Hmm...");
      } else {
        const turnMessages = ["Nice move! My turn next", "Yay! Your turn!"];
        const randomMessage =
          turnMessages[Math.floor(Math.random() * turnMessages.length)];
        setSpeechText(randomMessage);
      }
      return;
    }
    if (gameState === GameState.WON) {
      setSpeechText("You won! Great job!");
      return;
    }
    if (gameState === GameState.TIE) {
      const playerName = userProfile?.name || "friend";
      setSpeechText(`Nice job ${playerName}! It looks like a tie!`);
      return;
    }
    if (gameState === GameState.LOSS) {
      const playerName = userProfile?.name || "friend";
      setSpeechText(`That was fun! I loved playing with you ${playerName}!`);
      return;
    }
  }, [gameState, aiIsThinking, setSpeechText, userProfile?.name]);

  const petMovesLeft = Math.max(
    0,
    4 - board.filter((val) => val === "O").length,
  );
  const playerMovesLeft = Math.max(
    0,
    5 - board.filter((val) => val === "X").length,
  );

  useEffect(() => {
    if (gameState !== GameState.START) {
      return;
    }

    let message = "Yay lets start! It's your turn first.";
    if (difficulty === "expert") {
      message = "Looking for a challenge I see!";
    } else if (difficulty === "normal") {
      message = "Good choice! Let's have some fun!";
    }
    setSpeechText(message);
  }, [difficulty, gameState, setSpeechText]);

  const handleGameWin = async () => {
    if (!userId || isProcessingWin) return;

    setIsProcessingWin(true);
    setWinRewardDetails?.(null);

    try {
      const coinsAlreadyEarned = gameStatistics?.coinsEarnedToday ?? 0;
      const stats = await recordGameResult.mutateAsync({
        userId,
        gameName: GameName.TIC_TAC_TOE,
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
    } catch {
      setWinRewardDetails?.(null);
      showInformationModal({
        title: "YOU WIN!",
        message: "Great job! You won the game!",
        onClose: () => {
          setGameState(GameState.WON);
        },
      });
    } finally {
      setIsProcessingWin(false);
    }
  };

  const handleSquareClick = (index: number) => {
    if (gameState !== GameState.PLAYING || aiIsThinking) return;
    if (board[index] !== null) return;

    const newBoard = [...board];
    newBoard[index] = "X";

    const winner = calculateWinner(newBoard);
    if (winner === "X") {
      setBoard(newBoard);
      handleGameWin();
      return;
    }

    const emptySquares = newBoard.filter((val) => val === null).length;
    if (emptySquares === 0) {
      if (userId) {
        void recordGameResult.mutateAsync({
          userId,
          gameName: GameName.TIC_TAC_TOE,
          result: GameResult.DRAW,
        });
      }
      setGameState(GameState.TIE);
      setBoard(newBoard);
      return;
    }

    setBoard(newBoard);
    setAiIsThinking(true);

    // 2 second delay
    aiMoveTimeoutRef.current = setTimeout(() => {
      aiMoveTimeoutRef.current = null;
      const aiBoard = makeAIMove(newBoard, difficulty);
      const aiWinner = calculateWinner(aiBoard);
      if (aiWinner === "O") {
        if (userId) {
          void recordGameResult.mutateAsync({
            userId,
            gameName: GameName.TIC_TAC_TOE,
            result: GameResult.LOSS,
          });
        }
        setGameState(GameState.LOSS);
        setBoard(aiBoard);
        setAiIsThinking(false);
        return;
      }

      const emptySquaresAfterAI = aiBoard.filter((val) => val === null).length;
      if (emptySquaresAfterAI === 0) {
        if (userId) {
          void recordGameResult.mutateAsync({
            userId,
            gameName: GameName.TIC_TAC_TOE,
            result: GameResult.DRAW,
          });
        }
        setGameState(GameState.TIE);
        setBoard(aiBoard);
        setAiIsThinking(false);
        return;
      }

      setBoard(aiBoard);
      setAiIsThinking(false);
    }, 2000);
  };

  return (
    <div className="pt-12 flex h-full w-full flex-col items-center justify-center overflow-hidden">
      {gameState !== GameState.START && (
        <div className="grid grid-cols-3 gap-4">
          {board.map((value, index) => {
            const row = Math.floor(index / 3);
            const col = index % 3;
            const isTopRow = row === 0;
            const isBottomRow = row === 2;
            const isLeftCol = col === 0;
            const isRightCol = col === 2;

            return (
              <button
                key={index}
                onClick={() => handleSquareClick(index)}
                disabled={aiIsThinking || gameState !== GameState.PLAYING}
                className={`flex h-24 w-24 items-center justify-center rounded-2xl disabled:opacity-50 transition-colors ${
                  value === null
                    ? "bg-icanGreen-100 hover:bg-icanGreen-200"
                    : ""
                } ${isTopRow ? "mt-0" : ""} ${isBottomRow ? "mb-0" : ""} ${isLeftCol ? "ml-0" : ""} ${isRightCol ? "mr-0" : ""}`}
              >
                {value === "X" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/games/tictactoe/x.png"
                    alt="X"
                    className="h-24 w-24 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
                {value === "O" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src="/games/tictactoe/o.png"
                    alt="O"
                    className="h-24 w-24 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {gameState === GameState.START && (
          <button
            onClick={handleStart}
            className="rounded-xl border-4 border-icanBlue-200 bg-icanGreen-300 px-6 py-3 text-white shadow-[0_4px_0_0_#7D83B2] font-quantico text-lg"
          >
            Start Game
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {gameState === GameState.START && (
          <>
            <button
              onClick={() => setDifficulty("easy")}
              className={`rounded-xl border-4 px-4 py-2 shadow-[0_4px_0_0_#7D83B2] font-quantico ${
                difficulty === "easy"
                  ? "border-icanBlue-200 bg-icanBlue-200 text-white"
                  : "border-icanBlue-200 bg-white text-icanBlue-300"
              }`}
            >
              Easy
            </button>
            <button
              onClick={() => setDifficulty("normal")}
              className={`rounded-xl border-4 px-4 py-2 shadow-[0_4px_0_0_#7D83B2] font-quantico ${
                difficulty === "normal"
                  ? "border-icanBlue-200 bg-icanBlue-200 text-white"
                  : "border-icanBlue-200 bg-white text-icanBlue-300"
              }`}
            >
              Normal
            </button>
            <button
              onClick={() => setDifficulty("expert")}
              className={`rounded-xl border-4 px-4 py-2 shadow-[0_4px_0_0_#7D83B2] font-quantico ${
                difficulty === "expert"
                  ? "border-icanBlue-200 bg-icanBlue-200 text-white"
                  : "border-icanBlue-200 bg-white text-icanBlue-300"
              }`}
            >
              Expert
            </button>
          </>
        )}
      </div>

      {gameState === GameState.PLAYING && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-16 pb-8">
          {/* Pet moves */}
          <div className="flex flex-col items-start">
            <p className="font-quantico text-white text-4xl font-bold">
              Pet&apos;s turns left:
            </p>
            <div className="mt-2.5 flex gap-4">
              {Array(petMovesLeft)
                .fill(null)
                .map((_, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src="/games/tictactoe/o.png"
                    alt="O"
                    className="h-14 w-14 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                ))}
            </div>
          </div>

          {/* Player moves */}
          <div className="flex flex-col items-end">
            <p className="font-quantico text-white text-4xl font-bold">
              Your turns left:
            </p>
            <div className="mt-2.5 flex gap-3">
              {Array(playerMovesLeft)
                .fill(null)
                .map((_, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src="/games/tictactoe/x.png"
                    alt="X"
                    className="h-14 w-14 object-contain"
                    style={{ imageRendering: "pixelated" }}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
