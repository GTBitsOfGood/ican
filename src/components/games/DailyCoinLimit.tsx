import Image from "next/image";

const DAILY_COIN_LIMIT = 100;

export default function DailyCoinLimit() {
  const coinsLeft = DAILY_COIN_LIMIT;
  const progressPercent =
    ((DAILY_COIN_LIMIT - coinsLeft) / DAILY_COIN_LIMIT) * 100;

  return (
    <div className="mx-6 mt-4 rounded-xl bg-icanBlue-100/40 px-5 py-4">
      <p className="font-quantico text-base font-bold text-white">
        Daily Coin Limit
      </p>
      <p className="font-quantico text-sm text-white/80">
        You can earn up to {DAILY_COIN_LIMIT} coins from games today.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Image
          src="/games/coin.png"
          alt="Coin"
          width={32}
          height={32}
          className="object-contain"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="relative flex-1 h-5 rounded-full bg-black/20 overflow-hidden border-2 border-black/30">
          <div
            className="h-full rounded-full bg-icanGreen-300 transition-all"
            style={{ width: `${Math.max(progressPercent, 2)}%` }}
          />
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-pixelify text-xs text-white font-bold">
            {coinsLeft} COINS LEFT
          </span>
        </div>
      </div>
    </div>
  );
}
