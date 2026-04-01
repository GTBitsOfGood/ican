import {
  GAMES_COINS_BASE,
  GAMES_COINS_PER_STREAK,
  GAMES_DAILY_COIN_LIMIT,
  MAX_STREAK_DAYS,
} from "@/utils/constants";

export default class GameRewardsService {
  /**
   * Calculates coins accounting for streak and streak cap
   * Formula: GAMES_COINS_BASE + (GAMES_COINS_PER_STREAK * cappedStreak)
   */
  static calculateGameCoins(streakInDays: number): number {
    const cappedStreak = Math.min(streakInDays, MAX_STREAK_DAYS);
    return GAMES_COINS_BASE + GAMES_COINS_PER_STREAK * cappedStreak;
  }

  static isWithinDailyLimit(
    coinsToEarn: number,
    coinsAlreadyEarnedToday: number,
  ): boolean {
    return coinsAlreadyEarnedToday + coinsToEarn <= GAMES_DAILY_COIN_LIMIT;
  }

  /**
   * Returns the amount of coins earned accounting for daily limit
   */
  static getActualCoinsToEarn(
    coinsToEarn: number,
    coinsAlreadyEarnedToday: number,
  ): number {
    const total = coinsAlreadyEarnedToday + coinsToEarn;
    if (total > GAMES_DAILY_COIN_LIMIT) {
      return Math.max(0, GAMES_DAILY_COIN_LIMIT - coinsAlreadyEarnedToday);
    }
    return coinsToEarn;
  }
}
