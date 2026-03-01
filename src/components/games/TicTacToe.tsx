import { useEffect, useState } from "react";
import { GameState, type GameWrapperControls } from "./GameWrapper";

type Board = (string | null)[];
type Difficulty = "normal" | "expert";

export default function TicTacToe({
  setSpeechText,
  gameState,
  setGameState,
}: GameWrapperControls) {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [aiIsThinking, setAiIsThinking] = useState(false);
  const [prevGameState, setPrevGameState] = useState<GameState>(gameState);

  useEffect(() => {
    if (
      gameState === GameState.PLAYING &&
      (prevGameState === GameState.WON ||
        prevGameState === GameState.LOSS ||
        prevGameState === GameState.TIE)
    ) {
      setBoard(Array(9).fill(null));
    }
    setPrevGameState(gameState);
  }, [gameState, prevGameState]);

  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Let's play Tic Tac Toe! You are X.");
      return;
    }
    if (gameState === GameState.PLAYING) {
      if (aiIsThinking) {
        setSpeechText("Hmm...");
      } else {
        setSpeechText("Your turn!");
      }
      return;
    }
    if (gameState === GameState.WON) {
      setSpeechText("You won! Great job!");
      return;
    }
    if (gameState === GameState.TIE) {
      setSpeechText("That was close!");
      return;
    }
    if (gameState === GameState.LOSS) {
      setSpeechText("Nice try! Good luck next time!");
      return;
    }
  }, [gameState, aiIsThinking, setSpeechText]);

  useEffect(() => {
    if (gameState === GameState.START && difficulty === "expert") {
      setSpeechText("Looking for a challenge I see!");
    }
  }, [difficulty, gameState, setSpeechText]);

  const calculateWinner = (squares: Board): string | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  };

  // for the expert ai
  const minimax = (currentBoard: Board, isMaximizing: boolean): number => {
    const winner = calculateWinner(currentBoard);
    if (winner === "O") return 10;
    if (winner === "X") return -10;
    if (currentBoard.every((square) => square !== null)) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = "O";
          const score = minimax(newBoard, false);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < currentBoard.length; i++) {
        if (currentBoard[i] === null) {
          const newBoard = [...currentBoard];
          newBoard[i] = "X";
          const score = minimax(newBoard, true);
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const getBestMove = (currentBoard: Board): number => {
    let bestScore = -Infinity;
    let bestMove = 0;

    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i] === null) {
        const newBoard = [...currentBoard];
        newBoard[i] = "O";
        const score = minimax(newBoard, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  };

  const makeRandomMove = (currentBoard: Board): Board => {
    const emptySquares = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null) as number[];

    if (emptySquares.length === 0) return currentBoard;

    const randomIndex = Math.floor(Math.random() * emptySquares.length);
    const newBoard = [...currentBoard];
    newBoard[emptySquares[randomIndex]] = "O";
    return newBoard;
  };

  const makeAIMove = (currentBoard: Board): Board => {
    if (difficulty === "expert") {
      const bestMove = getBestMove(currentBoard);
      const newBoard = [...currentBoard];
      newBoard[bestMove] = "O";
      return newBoard;
    } else {
      return makeRandomMove(currentBoard);
    }
  };

  const handleSquareClick = (index: number) => {
    if (gameState !== GameState.PLAYING || aiIsThinking) return;
    if (board[index] !== null) return;

    const newBoard = [...board];
    newBoard[index] = "X";

    const winner = calculateWinner(newBoard);
    if (winner === "X") {
      setGameState(GameState.WON);
      setBoard(newBoard);
      return;
    }

    const emptySquares = newBoard.filter((val) => val === null).length;
    if (emptySquares === 0) {
      setGameState(GameState.TIE);
      setBoard(newBoard);
      return;
    }

    setBoard(newBoard);
    setAiIsThinking(true);

    // 2 second delay
    setTimeout(() => {
      const aiBoard = makeAIMove(newBoard);
      const aiWinner = calculateWinner(aiBoard);
      if (aiWinner === "O") {
        setGameState(GameState.LOSS);
        setBoard(aiBoard);
        setAiIsThinking(false);
        return;
      }

      const emptySquaresAfterAI = aiBoard.filter((val) => val === null).length;
      if (emptySquaresAfterAI === 0) {
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
    <div className="flex h-full w-full flex-col items-center justify-center px-6 py-8">
      {gameState !== GameState.START && (
        <div className="grid grid-cols-3 gap-3">
          {board.map((value, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              disabled={aiIsThinking || gameState !== GameState.PLAYING}
              className="flex h-20 w-20 items-center justify-center rounded-lg border-4 border-icanBlue-200 bg-white text-3xl font-bold text-icanBlue-300 shadow-[0_4px_0_0_#7D83B2] hover:bg-gray-100 disabled:opacity-50"
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {gameState === GameState.START && (
          <button
            onClick={() => setGameState(GameState.PLAYING)}
            className="rounded-xl border-4 border-icanBlue-200 bg-icanGreen-300 px-6 py-3 text-white shadow-[0_4px_0_0_#7D83B2] font-quantico text-lg"
          >
            Start Game
          </button>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        {gameState !== GameState.PLAYING && (
          <>
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
    </div>
  );
}
