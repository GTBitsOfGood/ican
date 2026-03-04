import { Types } from "mongoose";
import UserModel from "../models/user";
import dbConnect from "../dbConnect";
import { GameName, GameResult, GameStats } from "@/types/games";
import { NotFoundError } from "@/types/exceptions";
import ERRORS from "@/utils/errorMessages";

export default class GameStatisticsDAO {
  static async getGameStatistics(
    userId: string,
  ): Promise<Map<string, GameStats>> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();
    const user = await UserModel.findById(_id).select("gameStatistics");
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    return user.gameStatistics ?? new Map();
  }

  static async recordGameResult(
    userId: string,
    gameName: GameName,
    result: GameResult,
  ): Promise<void> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();

    const isWin = result === GameResult.WIN;
    const fieldRef = `$gameStatistics.${gameName}`;

    const updateResult = await UserModel.updateOne({ _id }, [
      {
        $set: {
          [`gameStatistics.${gameName}.wins`]: {
            $add: [{ $ifNull: [`${fieldRef}.wins`, 0] }, isWin ? 1 : 0],
          },
          [`gameStatistics.${gameName}.losses`]: {
            $add: [
              { $ifNull: [`${fieldRef}.losses`, 0] },
              result === GameResult.LOSS ? 1 : 0,
            ],
          },
          [`gameStatistics.${gameName}.currentWinStreak`]: isWin
            ? { $add: [{ $ifNull: [`${fieldRef}.currentWinStreak`, 0] }, 1] }
            : 0,
          [`gameStatistics.${gameName}.bestWinStreak`]: isWin
            ? {
                $max: [
                  { $ifNull: [`${fieldRef}.bestWinStreak`, 0] },
                  {
                    $add: [{ $ifNull: [`${fieldRef}.currentWinStreak`, 0] }, 1],
                  },
                ],
              }
            : { $ifNull: [`${fieldRef}.bestWinStreak`, 0] },
          [`gameStatistics.${gameName}.lastTenResults`]: {
            $slice: [
              {
                $concatArrays: [
                  { $ifNull: [`${fieldRef}.lastTenResults`, []] },
                  [result],
                ],
              },
              -10,
            ],
          },
        },
      },
    ]);

    if (updateResult.matchedCount === 0) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
  }
}
