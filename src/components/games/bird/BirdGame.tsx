import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";

type Pipe = {
  id: number;
  x: number;
  gapY: number; // where gap starts from top
  scored: boolean; // true once the bird has passed this pipe
};

const BIRD_SIZE_RATIO = 0.07; // fraction of board height
const BIRD_X_RATIO = 0.12; // fraction of board width
const GRAVITY = 0.35;
const FLAP_STRENGTH = -6;
const TICK_MS = 16;
const PIPE_WIDTH_RATIO = 0.09; // fraction of board width
const PIPE_GAP_RATIO = 0.42; // fraction of board height
const PIPE_SPEED = 3;
const PIPE_SPAWN = 120;

export default function BirdGame({
  setSpeechText,
  gameState,
  setGameState,
}: GameWrapperControls) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const spawnCounter = useRef(0);

  // Physics refs are the authoritative source of truth for the game loop.
  // React state is derived from them solely for rendering.
  const birdYRef = useRef(0);
  const birdVelocityRef = useRef(0);
  const pipesRef = useRef<Pipe[]>([]);
  const gameOverRef = useRef(false);

  const [boardHeight, setBoardHeight] = useState(0);
  const [boardWidth, setBoardWidth] = useState(0);
  const [birdY, setBirdY] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);

  const resetGame = useCallback(
    (height = boardHeight) => {
      const startY = height > 0 ? height * 0.25 : 0;
      birdYRef.current = startY;
      birdVelocityRef.current = 0;
      pipesRef.current = [];
      gameOverRef.current = false;
      spawnCounter.current = 0;
      setBirdY(startY);
      setPipes([]);
      setScore(0);
    },
    [boardHeight],
  );

  const handleStartOrReplay = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  };

  const birdSize = boardHeight * BIRD_SIZE_RATIO;
  const birdX = boardWidth * BIRD_X_RATIO;
  const pipeWidth = boardWidth * PIPE_WIDTH_RATIO;
  const pipeGap = boardHeight * PIPE_GAP_RATIO;

  useEffect(() => {
    if (gameState === GameState.START && boardHeight > 0) {
      resetGame();
    }
  }, [gameState, boardHeight, resetGame]);

  useEffect(() => {
    const measureBoard = () => {
      if (!boardRef.current) return;
      setBoardHeight(boardRef.current.clientHeight);
      setBoardWidth(boardRef.current.clientWidth);
    };

    measureBoard();
    window.addEventListener("resize", measureBoard);
    return () => window.removeEventListener("resize", measureBoard);
  }, []);

  useEffect(() => {
    if (gameState === GameState.START) {
      setSpeechText("Press start, then space to flap!");
      return;
    }
    if (gameState === GameState.PLAYING) {
      setSpeechText("Press space to flap!");
      return;
    }
    if (gameState === GameState.WON) {
      setSpeechText("Amazing! You have won!");
      return;
    }
    setSpeechText("Nice try!");
  }, [gameState, setSpeechText]);

  useEffect(() => {
    if (gameState !== GameState.PLAYING || boardHeight === 0) return;

    const activeBirdSize = boardHeight * BIRD_SIZE_RATIO;
    const activeBirdX = boardWidth * BIRD_X_RATIO;
    const activePipeWidth = boardWidth * PIPE_WIDTH_RATIO;
    const activePipeGap = boardHeight * PIPE_GAP_RATIO;

    const intervalId = window.setInterval(() => {
      // Skip ticks that fire between setGameState(LOSS) and the cleanup running.
      if (gameOverRef.current) return;

      // Advance pipes
      let pointScored = false;
      const movedPipes = pipesRef.current
        .map((pipe) => {
          const newX = pipe.x - PIPE_SPEED;
          const justPassed =
            !pipe.scored && activeBirdX > pipe.x + activePipeWidth - PIPE_SPEED;
          if (justPassed) pointScored = true;
          return { ...pipe, x: newX, scored: pipe.scored || justPassed };
        })
        .filter((pipe) => pipe.x + activePipeWidth > 0);

      // Spawn pipes
      spawnCounter.current += 1;
      if (spawnCounter.current >= PIPE_SPAWN) {
        const gap = boardHeight * PIPE_GAP_RATIO;
        if (boardHeight > gap) {
          movedPipes.push({
            id: Date.now(),
            x: boardRef.current?.clientWidth ?? 400,
            gapY: Math.random() * (boardHeight - gap),
            scored: false,
          });
        }
        spawnCounter.current = 0;
      }

      pipesRef.current = movedPipes;

      // Physics
      const newVelocity = birdVelocityRef.current + GRAVITY;
      const rawY = birdYRef.current + newVelocity;

      let collision = false;
      let nextY = rawY;

      if (rawY <= 0) {
        collision = true;
        nextY = 0;
      } else if (rawY + activeBirdSize >= boardHeight) {
        collision = true;
        nextY = boardHeight - activeBirdSize;
      } else {
        const birdLeft = activeBirdX;
        const birdRight = activeBirdX + activeBirdSize;
        const birdTop = rawY;
        const birdBottom = rawY + activeBirdSize;

        for (const pipe of movedPipes) {
          const horizontalOverlap =
            birdRight > pipe.x && birdLeft < pipe.x + activePipeWidth;
          if (horizontalOverlap) {
            const hitsTop = birdTop < pipe.gapY;
            const hitsBottom = birdBottom > pipe.gapY + activePipeGap;
            if (hitsTop || hitsBottom) {
              collision = true;
              nextY = rawY;
              break;
            }
          }
        }
      }

      birdVelocityRef.current = newVelocity;
      birdYRef.current = nextY;

      if (pointScored) setScore((s) => s + 1);
      setBirdY(nextY);
      setPipes([...movedPipes]);

      if (collision) {
        gameOverRef.current = true;
        setGameState(GameState.LOSS);
      }
    }, TICK_MS);

    return () => window.clearInterval(intervalId);
  }, [gameState, boardHeight, boardWidth, setGameState]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;
      event.preventDefault();
      if (gameState === GameState.PLAYING) {
        birdVelocityRef.current = FLAP_STRENGTH;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  const isGameOver =
    gameState === GameState.LOSS || gameState === GameState.WON;

  return (
    <div className="h-full w-full">
      <div
        ref={boardRef}
        className="relative h-full w-full overflow-hidden bg-sky-100"
      >
        {/* Score — visible while playing and on the end screen */}
        {(gameState === GameState.PLAYING || isGameOver) && (
          <div className="absolute top-3 right-4 z-10 font-quantico text-2xl font-bold text-icanBlue-300 select-none">
            {score}
          </div>
        )}

        {/* Bird */}
        <div
          className="absolute rounded-full bg-yellow-400"
          style={{
            top: `${birdY}px`,
            left: `${birdX}px`,
            width: `${birdSize}px`,
            height: `${birdSize}px`,
          }}
        />

        {/* Pipes */}
        {pipes.map((pipe) => (
          <div key={pipe.id}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500"
              style={{
                left: `${pipe.x}px`,
                top: 0,
                width: `${pipeWidth}px`,
                height: `${pipe.gapY}px`,
              }}
            />

            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.gapY + pipeGap}px`,
                width: `${pipeWidth}px`,
                height: `${boardHeight - (pipe.gapY + pipeGap)}px`,
              }}
            />
          </div>
        ))}

        {gameState !== GameState.PLAYING && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {isGameOver && (
              <p className="font-quantico text-3xl font-bold text-icanBlue-300">
                Score: {score}
              </p>
            )}
            <button
              onClick={handleStartOrReplay}
              className="text-center font-quantico text-icanBlue-300 rounded-xl border-4 border-icanBlue-200 bg-white px-4 py-2 shadow-[0_4px_0_0_#7D83B2]"
            >
              {gameState === GameState.LOSS ? "Replay" : "Start"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
