import fetchHTTPClient from "@/http/fetchHTTPClient";

export interface GameStatsResponse {
  streakInDays: number;
  coinsEarnedToday: number;
}

export interface RecordGameWinRequest {
  gameType: string;
  coinsEarned: number;
}

export default class GameStatsHTTPClient {
  /**
   * gets streak count and coins already earned today
   */
  static async getGameStats(userId: string): Promise<GameStatsResponse> {
    return await fetchHTTPClient<GameStatsResponse>(
      `/users/${userId}/game-stats`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  static async recordGameWin(
    userId: string,
    gameType: string,
    coinsEarned: number,
  ): Promise<GameStatsResponse> {
    const body: RecordGameWinRequest = {
      gameType,
      coinsEarned,
    };

    return await fetchHTTPClient<GameStatsResponse>(
      `/users/${userId}/game-stats/record-win`,
      {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
      },
    );
  }
}
