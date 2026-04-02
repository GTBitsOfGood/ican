import fetchHTTPClient from "./fetchHTTPClient";
import { GameName, GameResult, GameStatistics } from "@/types/games";

export default class GameStatisticsHTTPClient {
  static async getGameStatistics(userId: string): Promise<GameStatistics> {
    return await fetchHTTPClient(`/users/${userId}/game-statistics`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async recordGameResult(
    userId: string,
    gameName: GameName,
    result: GameResult,
  ): Promise<void> {
    return await fetchHTTPClient(`/users/${userId}/game-statistics/record`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ gameName, result }),
    });
  }
}
