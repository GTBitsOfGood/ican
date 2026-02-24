import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";
import {
  PERFECT_WEEK_BONUS,
  PERFECT_WEEK_DAYS,
  STREAK_MILESTONES,
  STREAK_START_DAYS,
} from "@/utils/constants";

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  perfectWeeksCount: number;
  lastDoseDate: Date;
  coinsAwarded: number;
  isPerfectWeek: boolean;
  isNewMilestone: boolean;
  milestoneReached?: number;
}

export function calculateStreakUpdate(
  pet: WithId<Pet>,
  doseDate: Date,
): StreakUpdate {
  const today = new Date(doseDate);
  today.setHours(0, 0, 0, 0);

  let currentStreak = pet.currentStreak;
  let longestStreak = pet.longestStreak;
  let perfectWeeksCount = pet.perfectWeeksCount;
  let coinsAwarded = 0;
  let isPerfectWeek = false;
  let isNewMilestone = false;
  let milestoneReached: number | undefined = undefined;

  if (!pet.lastDoseDate) {
    currentStreak = 1;
  } else {
    const lastDose = new Date(pet.lastDoseDate);
    lastDose.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (today.getTime() - lastDose.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysDifference === 0) {
      return {
        currentStreak,
        longestStreak,
        perfectWeeksCount,
        lastDoseDate: today,
        coinsAwarded: 0,
        isPerfectWeek: false,
        isNewMilestone: false,
      };
    } else if (daysDifference === 1) {
      currentStreak += 1;

      if (currentStreak > 0 && currentStreak % PERFECT_WEEK_DAYS === 0) {
        isPerfectWeek = true;
        perfectWeeksCount += 1;
        coinsAwarded = PERFECT_WEEK_BONUS;
      }

      if (currentStreak >= STREAK_START_DAYS) {
        const currentMilestone = STREAK_MILESTONES.find(
          (m) => m === currentStreak,
        );

        if (currentMilestone) {
          isNewMilestone = true;
          milestoneReached = currentMilestone;
        }
      }
    } else {
      currentStreak = 1;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    perfectWeeksCount,
    lastDoseDate: today,
    coinsAwarded,
    isPerfectWeek,
    isNewMilestone,
    milestoneReached,
  };
}

export function hasActiveStreak(pet: WithId<Pet>): boolean {
  return pet.currentStreak >= STREAK_START_DAYS;
}

export function daysUntilNextPerfectWeek(pet: WithId<Pet>): number {
  if (pet.currentStreak < STREAK_START_DAYS) {
    return PERFECT_WEEK_DAYS - pet.currentStreak;
  }

  const daysIntoCurrentWeek = pet.currentStreak % PERFECT_WEEK_DAYS;
  return PERFECT_WEEK_DAYS - daysIntoCurrentWeek;
}

export function getStreakItemCostForLevel(level: number): number {
  if (level <= 4) return 60;
  if (level <= 9) return 75;
  if (level <= 13) return 90;
  if (level <= 17) return 105;
  return 120;
}
