import { Types } from "mongoose";
import UserModel from "../models/user";
import PetModel from "../models/pet";
import dbConnect from "../dbConnect";
import { GameName, GameResult, GameStats } from "@/types/games";
import { NotFoundError } from "@/types/exceptions";
import ERRORS from "@/utils/errorMessages";
import { COINS_PER_WIN, GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";

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

  static async getDailyCoinsEarned(userId: string): Promise<number> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();
    const user = await UserModel.findById(_id).select(
      "gameCoinsEarnedToday gameCoinsLastResetDate",
    );
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    const today = new Date().toDateString();
    const lastReset = user.gameCoinsLastResetDate?.toDateString();
    if (lastReset !== today) return 0;
    return user.gameCoinsEarnedToday ?? 0;
  }

  static async recordGameResult(
    userId: string,
    gameName: GameName,
    result: GameResult,
  ): Promise<number> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();

    const isWin = result === GameResult.WIN;
    const isLoss = result === GameResult.LOSS;
    const isDraw = result === GameResult.DRAW;
    const today = new Date().toDateString();
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const existingUser = await UserModel.findById(_id).select(
      `gameStatistics.${gameName}`,
    );
    if (!existingUser) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const existing = existingUser.gameStatistics?.get(gameName);
    const lastPlayed = existing?.lastPlayedDate;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();

    let currentStreak: number;
    if (lastPlayed === today) {
      currentStreak = existing?.currentStreak ?? 1;
    } else if (lastPlayed === yesterday) {
      currentStreak = (existing?.currentStreak ?? 0) + 1;
    } else {
      currentStreak = 1;
    }
    const bestStreak = Math.max(currentStreak, existing?.bestStreak ?? 0);

    const previousUser = await UserModel.findOneAndUpdate(
      { _id },
      [
        {
          $set: {
            [`gameStatistics.${gameName}.wins`]: {
              $add: [
                { $ifNull: [`$gameStatistics.${gameName}.wins`, 0] },
                isWin ? 1 : 0,
              ],
            },
            [`gameStatistics.${gameName}.losses`]: {
              $add: [
                { $ifNull: [`$gameStatistics.${gameName}.losses`, 0] },
                isLoss ? 1 : 0,
              ],
            },
            [`gameStatistics.${gameName}.draws`]: {
              $add: [
                { $ifNull: [`$gameStatistics.${gameName}.draws`, 0] },
                isDraw ? 1 : 0,
              ],
            },
            [`gameStatistics.${gameName}.currentStreak`]: currentStreak,
            [`gameStatistics.${gameName}.bestStreak`]: bestStreak,
            [`gameStatistics.${gameName}.lastPlayedDate`]: today,
            [`gameStatistics.${gameName}.lastTenResults`]: {
              $slice: [
                {
                  $concatArrays: [
                    {
                      $ifNull: [
                        `$gameStatistics.${gameName}.lastTenResults`,
                        [],
                      ],
                    },
                    [result],
                  ],
                },
                -10,
              ],
            },
            gameCoinsEarnedToday: isWin
              ? {
                  $min: [
                    GAMES_DAILY_COIN_LIMIT,
                    {
                      $add: [
                        {
                          $cond: [
                            { $gte: ["$gameCoinsLastResetDate", startOfToday] },
                            { $ifNull: ["$gameCoinsEarnedToday", 0] },
                            0,
                          ],
                        },
                        COINS_PER_WIN,
                      ],
                    },
                  ],
                }
              : {
                  $cond: [
                    { $gte: ["$gameCoinsLastResetDate", startOfToday] },
                    { $ifNull: ["$gameCoinsEarnedToday", 0] },
                    0,
                  ],
                },
            ...(isWin ? { gameCoinsLastResetDate: now } : {}),
          },
        },
      ],
      { new: false, updatePipeline: true },
    ).select("gameCoinsEarnedToday gameCoinsLastResetDate");

    if (!previousUser) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const previousCoinsToday =
      previousUser.gameCoinsLastResetDate &&
      previousUser.gameCoinsLastResetDate >= startOfToday
        ? (previousUser.gameCoinsEarnedToday ?? 0)
        : 0;
    const coinsEarnedToday = isWin
      ? Math.min(GAMES_DAILY_COIN_LIMIT, previousCoinsToday + COINS_PER_WIN)
      : previousCoinsToday;
    const coinsToAward = Math.max(0, coinsEarnedToday - previousCoinsToday);

    if (coinsToAward > 0) {
      await PetModel.updateOne(
        { userId: _id },
        { $inc: { coins: coinsToAward } },
      );
    }

    return coinsEarnedToday;
  }
}
