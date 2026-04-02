import Image from "next/image";
import { DAILY_COIN_LIMIT } from "@/types/games";

interface DailyCoinLimitProps {
  coinsEarnedToday: number;
}

export default function DailyCoinLimit({
  coinsEarnedToday,
}: DailyCoinLimitProps) {
  const coinsLeft = DAILY_COIN_LIMIT - coinsEarnedToday;
  const remainingPercent = (coinsLeft / DAILY_COIN_LIMIT) * 100;
  const reached = coinsLeft <= 0;

  let title: string;
  let message: string;
  let barColor: string;

  if (reached) {
    title = "You\u2019ve reached today\u2019s coin limit";
    message = "You can still play, but you won\u2019t earn more coins today.";
    barColor = "bg-[#6b5c4c]";
  } else if (coinsLeft <= 20) {
    title = "You\u2019ve almost reached today\u2019s coin limit";
    message = "You can still play, but you\u2019ll stop earning coins soon.";
    barColor = "bg-red-400";
  } else if (coinsLeft <= 50) {
    title = "Daily Coin Limit";
    message = `You\u2019ve earned ${coinsEarnedToday} of ${DAILY_COIN_LIMIT} coins today. You can keep playing and earning coins.`;
    barColor = "bg-yellow-400";
  } else {
    title = "Daily Coin Limit";
    message =
      coinsEarnedToday > 0
        ? `You\u2019ve earned ${coinsEarnedToday} of ${DAILY_COIN_LIMIT} coins today. You can keep playing and earning coins.`
        : `You can earn up to ${DAILY_COIN_LIMIT} coins from games today.`;
    barColor = "bg-icanGreen-300";
  }

  return (
    <div className="mx-6 mt-4 rounded-xl bg-icanBlue-100/40 px-5 py-4">
      <p className="font-quantico text-base font-bold text-white">{title}</p>
      <p className="font-quantico text-sm text-white/80">{message}</p>
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
          <span className="absolute right-2 top-1/2 -translate-y-1/2 font-pixelify text-xs text-white font-bold">
            {Math.max(coinsLeft, 0)} COINS LEFT
          </span>
        </div>
      </div>
    </div>
  );
}
