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
   * Returns streak count and coins already earned today
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

    const isNewDay = !lastPlayDate || !this.isSameDay(now, lastPlayDate);

    if (isNewDay) {
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

    let newStreak = user.gameStreakDays || 0;
    let newCoinsToday = user.gameCoinsEarnedToday || 0;

    const isNewDay = !lastPlayDate || !this.isSameDay(now, lastPlayDate);

    if (isNewDay) {
      newStreak = newStreak > 0 ? newStreak + 1 : 1;
      newCoinsToday = 0;
    }

    newCoinsToday += coinsEarned;

    if (newCoinsToday > GAMES_DAILY_COIN_LIMIT) {
      newCoinsToday = GAMES_DAILY_COIN_LIMIT;
    }

    await UserDAO.updateUserById(userId, {
      gameStreakDays: newStreak,
      gameCoinsEarnedToday: newCoinsToday,
      gameLastPlayDate: now,
    });

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

  private static isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
}
