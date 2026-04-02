import Image from "next/image";
import Link from "next/link";
import { GameStats } from "@/types/games";

interface GameCardProps {
  name: string;
  banner: string;
  href: string;
  stats?: GameStats;
}

function calculateWinRate(stats: GameStats): {
  percent: number;
  wins: number;
  total: number;
} {
  const total = stats.wins + stats.losses + stats.draws;
  if (total === 0) return { percent: 0, wins: 0, total: 0 };
  return {
    percent: Math.round((stats.wins / total) * 100),
    wins: stats.wins,
    total,
  };
}

export default function GameCard({ name, banner, href, stats }: GameCardProps) {
  const hasStats = stats && stats.wins + stats.losses + stats.draws > 0;
  const winRate = stats ? calculateWinRate(stats) : null;

  return (
    <div className="flex flex-col overflow-hidden border-4 border-icanBlue-200 bg-white">
      <div className="w-full bg-white p-3">
        <div className="relative aspect-[16/10] w-full">
          <Image src={banner} alt={name} fill className="object-contain" />
        </div>
      </div>

      <div className="px-4 pt-3 pb-3">
        <div className="flex items-center gap-2">
          <Image
            src="/games/robot.png"
            alt=""
            width={24}
            height={24}
            className="object-contain"
            style={{ imageRendering: "pixelated" }}
          />
          <h3 className="font-quantico text-2xl font-bold text-gray-900">
            {name}
          </h3>
        </div>

        {hasStats ? (
          <div className="mt-3 grid grid-cols-3 divide-x divide-gray-200 text-center">
            <StatItem
              icon="/games/streak.png"
              label="Current Streak"
              value={String(stats.currentStreak)}
              sublabel="Days"
            />
            <StatItem
              icon="/games/best_streak.png"
              label="Best Streak"
              value={String(stats.bestStreak)}
              sublabel="Days"
            />
            <StatItem
              icon="/games/win_rate.png"
              label="Win Rate"
              value={`${winRate!.percent}%`}
              sublabel={`${winRate!.wins} / ${winRate!.total} Games`}
            />
          </div>
        ) : (
          <div className="mt-3 text-center text-sm text-gray-500">
            <p>No games played yet</p>
            <div className="flex items-center justify-center gap-1 font-bold">
              <Image
                src="/games/best_streak.png"
                alt=""
                width={14}
                height={14}
                className="object-contain"
              />
              Play to unlock your stats!
            </div>
          </div>
        )}
      </div>

      <Link
        href={href}
        className="block mx-3 mb-3 border-2 border-[#7a9a3a] bg-icanGreen-200 py-4 text-center font-quantico text-2xl font-bold text-black hover:bg-icanGreen-300 transition-colors"
      >
        Play
      </Link>
    </div>
  );
}

function StatItem({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: string;
  label: string;
  value: string;
  sublabel: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Image
          src={icon}
          alt=""
          width={12}
          height={12}
          className="object-contain"
        />
        {label}
      </div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-400">{sublabel}</p>
    </div>
  );
}
