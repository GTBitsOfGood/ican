import { useCallback, useEffect, useRef, useState } from "react";
import { GameState, type GameWrapperControls } from "../GameWrapper";

type Pipe = {
  id: number;
  x: number;
  gapY: number; //where gap starts from top
};

const BIRD_SIZE = 30;
const BIRD_X = 60;
const GRAVITY = 0.35;
const FLAP_STRENGTH = -6;
const TICK_MS = 16;
const PIPE_WIDTH = 50;
const PIPE_GAP = 175;
const PIPE_SPEED = 3;
const PIPE_SPAWN = 120;

export default function BirdGame({
  setSpeechText,
  gameState,
  setGameState,
}: GameWrapperControls) {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const spawnCounter = useRef(0);

  const [boardHeight, setBoardHeight] = useState<number>(0);
  const [birdY, setBirdY] = useState<number>(0);
  const [, setBirdVelocity] = useState<number>(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);

  const resetGame = (height = boardHeight) => {
    if (height > 0) {
      setBirdY(height * 0.25);
    }
    setBirdVelocity(0);
    setPipes([]);
    spawnCounter.current = 0;
  };

  const handleStartOrReplay = () => {
    resetGame();
    setGameState(GameState.PLAYING);
  };

  const spawnPipe = useCallback(() => {
    if (boardHeight <= PIPE_GAP) return;

    const gapY = Math.random() * (boardHeight - PIPE_GAP);

    const newPipe: Pipe = {
      id: Date.now(),
      x: boardRef.current?.clientWidth || 400,
      gapY,
    };

    setPipes((prev) => [...prev, newPipe]);
  }, [boardHeight]);

  useEffect(() => {
    if (gameState === GameState.START && boardHeight > 0) {
      setBirdY(boardHeight * 0.25);
      setBirdVelocity(0);
      setPipes([]);
      spawnCounter.current = 0;
    }
  }, [gameState, boardHeight]);

  useEffect(() => {
    const measureBoard = () => {
      if (!boardRef.current) return;
      const height = boardRef.current.clientHeight;
      setBoardHeight(height);
    };

    measureBoard();
    window.addEventListener("resize", measureBoard);

    return () => {
      window.removeEventListener("resize", measureBoard);
    };
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

    const intervalId = window.setInterval(() => {
      setPipes(
        (prevPipes) =>
          prevPipes
            .map((pipe) => ({
              ...pipe,
              x: pipe.x - PIPE_SPEED,
            }))
            .filter((pipe) => pipe.x + PIPE_WIDTH > 0), // remove off screen
      );

      spawnCounter.current += 1;
      if (spawnCounter.current >= PIPE_SPAWN) {
        spawnPipe();
        spawnCounter.current = 0;
      }

      setBirdVelocity((prevVelocity) => {
        const newVelocity = prevVelocity + GRAVITY;

        setBirdY((prevY) => {
          const newY = prevY + newVelocity;

          if (newY <= 0) {
            setGameState(GameState.LOSS);
            return 0;
          }

          if (newY + BIRD_SIZE >= boardHeight) {
            setGameState(GameState.LOSS);
            return boardHeight - BIRD_SIZE;
          }

          return newY;
        });

        return newVelocity;
      });
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [gameState, boardHeight, setGameState, spawnPipe]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space") return;

      event.preventDefault();

      if (gameState === GameState.PLAYING) {
        setBirdVelocity(FLAP_STRENGTH);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameState]);

  return (
    <div className="h-full w-full">
      <div
        ref={boardRef}
        className="relative h-full w-full overflow-hidden rounded-2xl bg-sky-100"
      >
        {/* Bird */}
        <div
          className="absolute rounded-full bg-yellow-400"
          style={{
            top: `${birdY}px`,
            left: `${BIRD_X}px`,
            width: `${BIRD_SIZE}px`,
            height: `${BIRD_SIZE}px`,
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
                width: `${PIPE_WIDTH}px`,
                height: `${pipe.gapY}px`,
              }}
            />

            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500"
              style={{
                left: `${pipe.x}px`,
                top: `${pipe.gapY + PIPE_GAP}px`,
                width: `${PIPE_WIDTH}px`,
                height: `${boardHeight - (pipe.gapY + PIPE_GAP)}px`,
              }}
            />
          </div>
        ))}

        {gameState !== GameState.PLAYING && (
          <div className="absolute inset-0 flex items-center justify-center">
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
