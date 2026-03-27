import {
  GAMES_COINS_BASE,
  GAMES_COINS_PER_STREAK,
  GAMES_DAILY_COIN_LIMIT,
  MAX_STREAK_DAYS,
} from "@/utils/constants";

export default class GameRewardsService {
  /**
   * Calculates coin reward for a game win based on streak
   * Caps streak at MAX_STREAK_DAYS to prevent extreme multipliers
   * Formula: GAMES_COINS_BASE + (GAMES_COINS_PER_STREAK * cappedStreak)
   */
  static calculateGameCoins(streakInDays: number): number {
    const cappedStreak = Math.min(streakInDays, MAX_STREAK_DAYS);
    return GAMES_COINS_BASE + GAMES_COINS_PER_STREAK * cappedStreak;
  }

  /**
   * Checks if earning coins would exceed the daily limit
   * Returns true if within limit, false if at or would exceed limit
   */
  static isWithinDailyLimit(
    coinsToEarn: number,
    coinsAlreadyEarnedToday: number,
  ): boolean {
    return coinsAlreadyEarnedToday + coinsToEarn <= GAMES_DAILY_COIN_LIMIT;
  }

  /**
   * Returns the amount of coins that can actually be earned given the daily limit
   * If already at limit, returns 0
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
