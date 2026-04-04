import Image from "next/image";
import { GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";

interface DailyCoinLimitProps {
  coinsEarnedToday: number;
}

export default function DailyCoinLimit({
  coinsEarnedToday,
}: DailyCoinLimitProps) {
  const coinsLeft = GAMES_DAILY_COIN_LIMIT - coinsEarnedToday;
  const remainingPercent = (coinsLeft / GAMES_DAILY_COIN_LIMIT) * 100;
  const reached = coinsLeft <= 0;
  const lowRemaining = remainingPercent <= 20;
  const mediumRemaining = remainingPercent <= 50;

  let title: string;
  let message: string;
  let barColor: string;

  if (reached) {
    title = "Daily Coin Limit";
    message = `You can earn up to ${GAMES_DAILY_COIN_LIMIT} coins from games today.`;
    barColor = "bg-[#6b5c4c]";
  } else if (lowRemaining) {
    title = "You\u2019ve almost reached today\u2019s coin limit";
    message = "You can still play, but you\u2019ll stop earning coins soon.";
    barColor = "bg-red-400";
  } else if (mediumRemaining) {
    title = "Daily Coin Limit";
    message = `You\u2019ve earned ${coinsEarnedToday} of ${GAMES_DAILY_COIN_LIMIT} coins today. You can keep playing and earning coins.`;
    barColor = "bg-yellow-400";
  } else {
    title = "Daily Coin Limit";
    message =
      coinsEarnedToday > 0
        ? `You\u2019ve earned ${coinsEarnedToday} of ${GAMES_DAILY_COIN_LIMIT} coins today. You can keep playing and earning coins.`
        : `You can earn up to ${GAMES_DAILY_COIN_LIMIT} coins from games today.`;
    barColor = "bg-icanGreen-300";
  }

  return (
    <div
      className="mx-6 mt-4 rounded-xl px-5 py-4"
      style={{ backgroundColor: "#B7BDEFB2" }}
    >
      <p className="font-quantico text-xl min-[1400px]:text-base font-bold text-black">
        {title}
      </p>
      <p className="font-quantico text-base min-[1400px]:text-sm text-black">
        {message}
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
            className={`h-full rounded-full ${barColor} transition-all`}
            style={{ width: `${remainingPercent}%` }}
          />
          <span className="absolute left-1/2 -translate-x-1/2 smallTablet:left-auto smallTablet:right-2 smallTablet:translate-x-0 top-1/2 -translate-y-1/2 font-pixelify text-xs text-white font-bold">
            {Math.max(coinsLeft, 0)} COINS LEFT
          </span>
        </div>
      </div>
    </div>
  );
}
