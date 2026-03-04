import { NotFoundError } from "@/types/exceptions";
import { GameResult, GameStatistics, GameStats } from "@/types/games";
import GameStatisticsDAO from "@/db/actions/gameStatistics";
import UserDAO from "@/db/actions/user";
import ERRORS from "@/utils/errorMessages";
import {
  validateGetGameStatistics,
  validateRecordGameResult,
} from "@/utils/serviceUtils/gameStatisticsUtil";

export default class GameStatisticsService {
  static async recordGameResult(
    userId: string,
    gameName: string,
    result: string,
  ): Promise<void> {
    validateRecordGameResult({ userId, gameName, result });

    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    await GameStatisticsDAO.recordGameResult(
      userId,
      gameName,
      result as GameResult,
    );
  }

  static async getGameStatistics(userId: string): Promise<GameStatistics> {
    validateGetGameStatistics({ userId });

    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const statsMap = await GameStatisticsDAO.getGameStatistics(userId);
    if (!statsMap) return {};

    const result: GameStatistics = {};
    statsMap.forEach((value: GameStats, key: string) => {
      result[key as keyof GameStatistics] = value;
    });
    return result;
  }
}
