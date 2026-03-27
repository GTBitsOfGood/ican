import UserDAO from "@/db/actions/user";
import PetDAO from "@/db/actions/pets";
import { NotFoundError } from "@/types/exceptions";
import ERRORS from "@/utils/errorMessages";
import { GAMES_DAILY_COIN_LIMIT } from "@/utils/constants";

interface GameStatsResponse {
  streakInDays: number;
  coinsEarnedToday: number;
}

export default class GameStatsService {
  /**
   * Gets the current game stats for a user
   * Returns streak count and coins already earned today
   * Resets daily coins if it's a new day
   */
  static async getGameStats(userId: string): Promise<GameStatsResponse> {
    const user = await UserDAO.getUserById(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const now = new Date();
    const lastPlayDate = user.gameLastPlayDate
      ? new Date(user.gameLastPlayDate)
      : null;

    // Check if we need to reset daily coins (new day)
    const isNewDay = !lastPlayDate || !this.isSameDay(now, lastPlayDate);

    if (isNewDay) {
      // Reset daily coins for new day
      await UserDAO.updateUserById(userId, {
        gameCoinsEarnedToday: 0,
      });
      return {
        streakInDays: user.gameStreakDays || 0,
        coinsEarnedToday: 0,
      };
    }

    return {
      streakInDays: user.gameStreakDays || 0,
      coinsEarnedToday: user.gameCoinsEarnedToday || 0,
    };
  }

  /**
   * Records a game win for the user
   * Updates streak, adds coins to pet, tracks daily earnings
   */
  static async recordGameWin(
    userId: string,
    gameType: string,
    coinsEarned: number,
  ): Promise<GameStatsResponse> {
    const user = await UserDAO.getUserById(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const pet = await PetDAO.getPetByUserId(userId);
    if (!pet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    const now = new Date();
    const lastPlayDate = user.gameLastPlayDate
      ? new Date(user.gameLastPlayDate)
      : null;

    // Calculate new streak
    let newStreak = user.gameStreakDays || 0;
    let newCoinsToday = user.gameCoinsEarnedToday || 0;

    // Check if this is a new day
    const isNewDay = !lastPlayDate || !this.isSameDay(now, lastPlayDate);

    if (isNewDay) {
      // New day: increment streak (or start at 1 if no previous streak)
      newStreak = newStreak > 0 ? newStreak + 1 : 1;
      newCoinsToday = 0; // Reset daily coins
    }

    // Add coins to today's total
    newCoinsToday += coinsEarned;

    // Ensure we don't exceed daily limit
    if (newCoinsToday > GAMES_DAILY_COIN_LIMIT) {
      newCoinsToday = GAMES_DAILY_COIN_LIMIT;
    }

    // Update user with new streak and daily coins
    await UserDAO.updateUserById(userId, {
      gameStreakDays: newStreak,
      gameCoinsEarnedToday: newCoinsToday,
      gameLastPlayDate: now,
    });

    // Add coins to pet
    const currentPetCoins = pet.coins || 0;
    await PetDAO.updatePetCoinsByPetId(
      pet._id.toString(),
      currentPetCoins + coinsEarned,
    );

    return {
      streakInDays: newStreak,
      coinsEarnedToday: newCoinsToday,
    };
  }

  /**
   * Helper function to check if two dates are the same day
   * Accounts for user's local timezone
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
