import { Types } from "mongoose";
import UserModel from "../models/user";
import dbConnect from "../dbConnect";
import { GameResult, GameStats } from "@/types/games";

const DEFAULT_GAME_STATS: GameStats = {
  wins: 0,
  losses: 0,
  bestWinStreak: 0,
  currentWinStreak: 0,
  lastTenResults: [],
};

export default class GameStatisticsDAO {
  static async getGameStatistics(
    userId: string,
  ): Promise<Map<string, GameStats> | undefined> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();
    const user = await UserModel.findById(_id).select("gameStatistics");
    return user?.gameStatistics;
  }

  static async recordGameResult(
    userId: string,
    gameName: string,
    result: GameResult,
  ): Promise<void> {
    const _id = new Types.ObjectId(userId);
    await dbConnect();

    const user = await UserModel.findById(_id).select("gameStatistics");
    if (!user) return;

    const stats: GameStats = user.gameStatistics?.get(gameName) ?? {
      ...DEFAULT_GAME_STATS,
    };

    const isWin = result === GameResult.WIN;

    stats.wins += isWin ? 1 : 0;
    stats.losses += isWin ? 0 : 1;
    stats.currentWinStreak = isWin ? stats.currentWinStreak + 1 : 0;
    stats.bestWinStreak = Math.max(stats.bestWinStreak, stats.currentWinStreak);
    stats.lastTenResults = [...stats.lastTenResults, result].slice(-10);

    await UserModel.updateOne(
      { _id },
      { $set: { [`gameStatistics.${gameName}`]: stats } },
    );
  }
}
