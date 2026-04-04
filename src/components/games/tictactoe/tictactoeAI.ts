import { TICTACTOE_MINIMAX_PROBABILITY } from "@/constant/tictactoeConstants";

export type Board = (string | null)[];
export type Difficulty = "easy" | "normal" | "expert";

export function calculateWinner(squares: Board): string | null {
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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export function makeRandomMove(currentBoard: Board): Board {
  const emptySquares = currentBoard
    .map((val, idx) => (val === null ? idx : null))
    .filter((val) => val !== null) as number[];

  if (emptySquares.length === 0) return currentBoard;

  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  const newBoard = [...currentBoard];
  newBoard[emptySquares[randomIndex]] = "O";
  return newBoard;
}

function minimax(currentBoard: Board, isMaximizing: boolean): number {
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
}

function getBestMove(currentBoard: Board): number {
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
}

export function makeAIMove(currentBoard: Board, difficulty: Difficulty): Board {
  const probability = TICTACTOE_MINIMAX_PROBABILITY[difficulty];
  const useMinimmax = Math.random() < probability;

  if (useMinimmax) {
    const bestMove = getBestMove(currentBoard);
    const newBoard = [...currentBoard];
    newBoard[bestMove] = "O";
    return newBoard;
  } else {
    return makeRandomMove(currentBoard);
  }
}
