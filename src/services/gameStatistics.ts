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
  ): Promise<void> {
    validateRecordGameResult({ userId, gameName, result });

    await GameStatisticsDAO.recordGameResult(userId, gameName, result);
  }

  static async getGameStatistics(userId: string): Promise<GameStatistics> {
    validateGetGameStatistics({ userId });

    const statsMap = await GameStatisticsDAO.getGameStatistics(userId);
    return Object.fromEntries(statsMap) as GameStatistics;
  }
}
