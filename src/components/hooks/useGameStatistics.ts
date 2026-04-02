import GameStatisticsHTTPClient from "@/http/gameStatisticsHTTPClient";
import { GameName, GameResult, GameStatistics } from "@/types/games";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const GAME_STATS_QUERY_KEYS = {
  statistics: (userId: string) => ["game-statistics", userId] as const,
} as const;

export const useGameStatistics = (userId: string | null) => {
  return useQuery<GameStatistics>({
    queryKey: GAME_STATS_QUERY_KEYS.statistics(userId || ""),
    queryFn: () => GameStatisticsHTTPClient.getGameStatistics(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useRecordGameResult = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      gameName,
      result,
    }: {
      userId: string;
      gameName: GameName;
      result: GameResult;
    }) => {
      return GameStatisticsHTTPClient.recordGameResult(
        userId,
        gameName,
        result,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: GAME_STATS_QUERY_KEYS.statistics(variables.userId),
      });
    },
  });
};
