import { GameName, GameResult, GameStatistics } from "@/types/games";
import GameStatisticsDAO from "@/db/actions/gameStatistics";
import {
  validateGetGameStatistics,
  validateRecordGameResult,
} from "@/utils/serviceUtils/gameStatisticsUtil";

export default class GameStatisticsService {
  static async recordGameResult(
    userId: string,
    gameName: GameName,
    result: GameResult,
  ): Promise<{ coinsEarnedToday: number }> {
    validateRecordGameResult({ userId, gameName, result });

    await GameStatisticsDAO.recordGameResult(userId, gameName, result);

    const coinsEarnedToday =
      result === GameResult.WIN
        ? await GameStatisticsDAO.awardGameCoins(userId)
        : await GameStatisticsDAO.getDailyCoinsEarned(userId);

    return { coinsEarnedToday };
  }

  static async getGameStatistics(
    userId: string,
  ): Promise<{ stats: GameStatistics; coinsEarnedToday: number }> {
    validateGetGameStatistics({ userId });

    const statsMap = await GameStatisticsDAO.getGameStatistics(userId);
    const coinsEarnedToday =
      await GameStatisticsDAO.getDailyCoinsEarned(userId);

    return {
      stats: Object.fromEntries(statsMap) as GameStatistics,
      coinsEarnedToday,
    };
  }
}
