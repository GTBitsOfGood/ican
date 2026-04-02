import { Types } from "mongoose";
import UserModel from "../models/user";
import PetModel from "../models/pet";
import dbConnect from "../dbConnect";
import {
  DAILY_COIN_LIMIT,
  GameName,
  GameResult,
  GameStats,
} from "@/types/games";
import { NotFoundError } from "@/types/exceptions";
import ERRORS from "@/utils/errorMessages";

const COINS_PER_WIN = 10;

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

  static async awardGameCoins(userId: string): Promise<number> {
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
    let coinsToday = lastReset === today ? (user.gameCoinsEarnedToday ?? 0) : 0;

    if (coinsToday >= DAILY_COIN_LIMIT) return coinsToday;

    const coinsToAward = Math.min(COINS_PER_WIN, DAILY_COIN_LIMIT - coinsToday);
    coinsToday += coinsToAward;

    await UserModel.updateOne(
      { _id },
      {
        gameCoinsEarnedToday: coinsToday,
        gameCoinsLastResetDate: new Date(),
      },
    );

    await PetModel.updateOne(
      { userId: _id },
      { $inc: { coins: coinsToAward } },
    );

    return coinsToday;
  }

  static async recordGameResult(
    userId: string,
    gameName: GameName,
    result: GameResult,
  ): Promise<void> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();

    const isWin = result === GameResult.WIN;
    const isLoss = result === GameResult.LOSS;
    const isDraw = result === GameResult.DRAW;
    const fieldRef = `$gameStatistics.${gameName}`;
    const today = new Date().toDateString();

    const user = await UserModel.findById(_id).select(
      `gameStatistics.${gameName}`,
    );
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const existing = user.gameStatistics?.get(gameName);
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

    await UserModel.updateOne(
      { _id },
      [
        {
          $set: {
            [`gameStatistics.${gameName}.wins`]: {
              $add: [{ $ifNull: [`${fieldRef}.wins`, 0] }, isWin ? 1 : 0],
            },
            [`gameStatistics.${gameName}.losses`]: {
              $add: [{ $ifNull: [`${fieldRef}.losses`, 0] }, isLoss ? 1 : 0],
            },
            [`gameStatistics.${gameName}.draws`]: {
              $add: [{ $ifNull: [`${fieldRef}.draws`, 0] }, isDraw ? 1 : 0],
            },
            [`gameStatistics.${gameName}.currentStreak`]: currentStreak,
            [`gameStatistics.${gameName}.bestStreak`]: bestStreak,
            [`gameStatistics.${gameName}.lastPlayedDate`]: today,
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
      ],
      { updatePipeline: true },
    );
  }
}
