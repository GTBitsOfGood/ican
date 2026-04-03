import Image from "next/image";

interface CoinLimitModalProps {
  gameName: string;
  onGoBack: () => void;
  onPlay: () => void;
}

export default function CoinLimitModal({
  gameName,
  onGoBack,
  onPlay,
}: CoinLimitModalProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-8">
      <div className="relative w-full max-w-2xl">
        <img
          src="/games/instruction_card.svg"
          alt=""
          className="w-full h-auto pointer-events-none select-none"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[10%] py-[8%] text-center">
          <p className="font-quantico text-xl uppercase mb-4 font-bold text-textBeige">
            GAME MODE: {gameName}
          </p>
          <Image
            src="/games/coin.png"
            alt="Coin"
            width={48}
            height={48}
            className="object-contain mb-4"
            style={{ imageRendering: "pixelated" }}
          />
          <h2 className="font-quantico text-4xl font-bold mb-3 text-textBeige">
            Daily coin limit reached!
          </h2>
          <p className="font-quantico text-xl font-bold leading-relaxed text-textBeige">
            You can still keep playing for fun!
            <br />
            Coins reset tomorrow
          </p>
          <div className="flex items-center gap-6 mt-6">
            <button
              type="button"
              onClick={onGoBack}
              className="font-quantico text-lg font-bold text-textBeige underline hover:opacity-80"
            >
              Go Back
            </button>
            <button
              type="button"
              onClick={onPlay}
              className="border-2 border-[#7a9a3a] bg-icanGreen-200 px-10 py-3 font-quantico text-xl font-bold text-black hover:bg-icanGreen-300 transition-colors"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
