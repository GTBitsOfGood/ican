import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import DailyCoinLimit from "@/components/games/DailyCoinLimit";
import GameCard from "@/components/games/GameCard";
import gameConfig from "@/lib/gameConfig";
import { useUser } from "@/components/UserContext";
import { useGameStatistics } from "@/components/hooks/useGameStatistics";

export default function GamesIndex() {
  const router = useRouter();
  const { userId } = useUser();
  const { data } = useGameStatistics(userId);
  const stats = data?.stats;
  const coinsEarnedToday = data?.coinsEarnedToday ?? 0;

  return (
    <AuthorizedRoute>
      <div className="min-h-screen bg-icanBlue-200 flex flex-col">
        <div className="flex items-center justify-between px-6 pt-6 pb-2 smallTablet:justify-center smallTablet:relative">
          <div className="w-10 hidden smallTablet:block" />
          <h1 className="font-quantico text-5xl smallTablet:text-4xl font-bold text-white">
            Games
          </h1>
          <div className="w-10 smallTablet:hidden" />
          <button
            type="button"
            onClick={() => router.push("/")}
            className="hover:opacity-80 transition-opacity absolute right-6"
            aria-label="Close"
          >
            <svg
              width="31"
              height="31"
              viewBox="0 0 31 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 25.5V18H5.6V12.5H11.3V10.3H5.6V4.8H0V0H8.1V5.5H13.8V10.9H17V5.5H22.6V0H30.8V4.8H25.1V10.3H19.5V12.5H25.1V18H30.8V25.5H22.6V20H17V14.5H13.8V20H8.1V25.5H0Z"
                fill="#98D03B"
              />
            </svg>
          </button>
        </div>

        <DailyCoinLimit coinsEarnedToday={coinsEarnedToday} />

        <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-6">
          <div className="grid grid-cols-1 gap-6 tablet:grid-cols-2 desktop:grid-cols-3">
            {gameConfig.map((game) => (
              <GameCard
                key={game.gameName}
                name={game.name}
                banner={game.banner}
                href={game.href}
                stats={stats?.[game.gameName]}
              />
            ))}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}
