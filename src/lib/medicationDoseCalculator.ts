import {
  addDays,
  addWeeks,
  addMonths,
  differenceInDays,
  format,
  isSameDay,
  setDate,
  getDay,
} from "date-fns";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface MedicationForDoseCalculation {
  createdAt: Date | string;
  updatedAt?: Date | string;
  repeatUnit?: "Day" | "Week" | "Month";
  repeatInterval?: number;
  repeatWeeklyOn?: string[];
  doseTimes?: string[];
  includeTimes?: boolean;
  repeatMonthlyType?: "Day" | "Week" | "dayOfMonth" | "nthWeekday";
  repeatMonthlyDay?: number;
  repeatMonthlyOnDay?: number;
  repeatMonthlyWeek?: number;
  repeatMonthlyOnWeek?: number;
  repeatMonthlyWeekday?: number;
  repeatMonthlyOnWeekDay?: string;
}

export interface DosePhrase {
  date: string;
  phrase: string;
}

/**
 * Calculates the next dose date and returns a human-readable phrase
 * @param medication The medication object
 * @param currentTime The current time (for testing purposes)
 * @returns Object with date (YYYY-MM-DD format) and phrase (e.g., "Today", "Tomorrow", "This Monday")
 */
export function getNextDosePhrase(
  medication: MedicationForDoseCalculation,
  currentTime: Date = new Date(),
): DosePhrase {
  const now = currentTime;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const ref = new Date(medication.updatedAt || medication.createdAt);
  const referenceDate = new Date(
    ref.getFullYear(),
    ref.getMonth(),
    ref.getDate(),
  );

  const hasUpcomingDoseTimeToday = (): boolean => {
    if (
      !medication.includeTimes ||
      !medication.doseTimes ||
      medication.doseTimes.length === 0
    ) {
      return false;
    }

    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return medication.doseTimes.some((time) => {
      const [hours, minutes] = time.split(":").map(Number);
      const doseMinutes = hours * 60 + minutes;
      return doseMinutes > currentMinutes;
    });
  };

  const sameDate = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const formatDatePhrase = (
    date: Date,
    med?: MedicationForDoseCalculation,
  ): string => {
    if (sameDate(date, today)) {
      if (med && med.repeatUnit === "Day" && (med.repeatInterval || 1) >= 7) {
        return `This ${DAYS_OF_WEEK[date.getDay()]}`;
      }
      return "Today";
    }
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (sameDate(date, tomorrow)) {
      return "Tomorrow";
    }

    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

    const nextWeekStart = new Date(thisWeekStart);
    nextWeekStart.setDate(thisWeekStart.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

    const inInterval = (d: Date, start: Date, end: Date) =>
      d.getTime() >= start.getTime() && d.getTime() <= end.getTime();

    if (inInterval(date, thisWeekStart, thisWeekEnd)) {
      return `This ${DAYS_OF_WEEK[date.getDay()]}`;
    }
    if (inInterval(date, nextWeekStart, nextWeekEnd)) {
      return `Next ${DAYS_OF_WEEK[date.getDay()]}`;
    }

    return format(date, "MMMM do");
  };

  let nextDoseDate: Date;

  if (!medication.repeatUnit) {
    nextDoseDate = addDays(today, 1);
  } else if (medication.repeatUnit === "Day") {
    const interval = medication.repeatInterval || 1;
    const daysSinceReference = differenceInDays(today, referenceDate);
    const intervalsPassed = Math.floor(daysSinceReference / interval);

    const todayIsDoseDay = daysSinceReference % interval === 0;

    if (
      todayIsDoseDay &&
      (hasUpcomingDoseTimeToday() || !medication.includeTimes)
    ) {
      nextDoseDate = today;
    } else {
      const nextIntervalNumber = intervalsPassed + 1;
      nextDoseDate = addDays(referenceDate, nextIntervalNumber * interval);
    }
  } else if (medication.repeatUnit === "Week") {
    const interval = medication.repeatInterval || 1;
    const selectedDays = medication.repeatWeeklyOn || [];

    const findNextDoseInDays = (
      daysToCheck: string[],
      startFrom: Date = today,
    ): Date | null => {
      const currentDayIndex = getDay(startFrom);
      const isStartingFromToday = startFrom.getTime() === today.getTime();
      const canUseTodayIfMatch =
        isStartingFromToday &&
        (hasUpcomingDoseTimeToday() || !medication.includeTimes);

      let closestDate: Date | null = null;

      for (const dayName of daysToCheck) {
        const targetDayIndex = DAYS_OF_WEEK.indexOf(dayName);
        if (targetDayIndex === -1) continue;

        const daysUntil = (targetDayIndex - currentDayIndex + 7) % 7;

        if (daysUntil === 0 && isStartingFromToday && !canUseTodayIfMatch) {
          continue;
        }

        const candidate = addDays(startFrom, daysUntil);

        if (!closestDate || candidate < closestDate) {
          closestDate = candidate;
        }
      }

      return closestDate;
    };

    if (interval === 1) {
      nextDoseDate =
        findNextDoseInDays(selectedDays) ||
        addDays(
          today,
          7 + DAYS_OF_WEEK.indexOf(selectedDays[0]) - getDay(today),
        );
    } else {
      const daysSinceReference = differenceInDays(today, referenceDate);
      const weeksSinceReference = Math.floor(daysSinceReference / 7);
      const currentWeekInCycle = weeksSinceReference % interval;

      if (currentWeekInCycle === 0) {
        const doseInCurrentCycle = findNextDoseInDays(selectedDays);
        if (doseInCurrentCycle) {
          nextDoseDate = doseInCurrentCycle;
        } else {
          const weeksToNextCycle = interval;
          const nextCycleStart = addWeeks(
            referenceDate,
            weeksSinceReference + weeksToNextCycle,
          );
          nextDoseDate =
            findNextDoseInDays(selectedDays, nextCycleStart) || nextCycleStart;
        }
      } else {
        const weeksToNextCycle = interval - currentWeekInCycle;
        const nextCycleWeekNumber = weeksSinceReference + weeksToNextCycle;
        const nextCycleStart = addWeeks(referenceDate, nextCycleWeekNumber);
        nextDoseDate =
          findNextDoseInDays(selectedDays, nextCycleStart) || nextCycleStart;
      }
    }
  } else {
    const interval = medication.repeatInterval || 1;

    const isNthWeekday =
      medication.repeatMonthlyType === "nthWeekday" ||
      medication.repeatMonthlyType === "Week";
    const isDayOfMonth =
      medication.repeatMonthlyType === "dayOfMonth" ||
      medication.repeatMonthlyType === "Day";

    if (isNthWeekday) {
      const week =
        medication.repeatMonthlyWeek || medication.repeatMonthlyOnWeek || 1; // 1st, 2nd, 3rd, 4th
      let weekday: number;
      if (typeof medication.repeatMonthlyWeekday === "number") {
        weekday = medication.repeatMonthlyWeekday;
      } else if (medication.repeatMonthlyOnWeekDay) {
        weekday = DAYS_OF_WEEK.indexOf(medication.repeatMonthlyOnWeekDay);
      } else {
        weekday = 1;
      }

      const calculateNthWeekdayOfMonth = (baseDate: Date): Date => {
        const firstOfMonth = setDate(baseDate, 1);
        const firstWeekday = getDay(firstOfMonth);
        const daysToTarget = (weekday - firstWeekday + 7) % 7;
        const targetDate = addDays(firstOfMonth, daysToTarget + (week - 1) * 7);
        return targetDate;
      };

      const thisMonthDose = calculateNthWeekdayOfMonth(today);
      if (
        thisMonthDose > today ||
        (isSameDay(thisMonthDose, today) &&
          (hasUpcomingDoseTimeToday() || !medication.includeTimes))
      ) {
        nextDoseDate = thisMonthDose;
      } else {
        const nextDoseMonth = addMonths(today, interval);
        nextDoseDate = calculateNthWeekdayOfMonth(nextDoseMonth);
      }
    } else if (isDayOfMonth) {
      const dayOfMonth =
        medication.repeatMonthlyDay || medication.repeatMonthlyOnDay || 1;

      const getLastDayOfMonth = (date: Date): number => {
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return nextMonth.getDate();
      };

      const getSafeDayOfMonth = (date: Date, targetDay: number): Date => {
        const lastDay = getLastDayOfMonth(date);
        const safeDay = Math.min(targetDay, lastDay);
        return setDate(date, safeDay);
      };

      const thisMonthDose = getSafeDayOfMonth(today, dayOfMonth);
      if (
        thisMonthDose > today ||
        (isSameDay(thisMonthDose, today) &&
          (hasUpcomingDoseTimeToday() || !medication.includeTimes))
      ) {
        nextDoseDate = thisMonthDose;
      } else {
        const monthsSinceReference = Math.floor(
          (today.getFullYear() - referenceDate.getFullYear()) * 12 +
            (today.getMonth() - referenceDate.getMonth()),
        );
        const nextIntervalNumber =
          Math.floor(monthsSinceReference / interval) + 1;
        const nextMonth = addMonths(
          referenceDate,
          nextIntervalNumber * interval,
        );
        nextDoseDate = getSafeDayOfMonth(nextMonth, dayOfMonth);
      }
    } else {
      nextDoseDate = addMonths(today, interval);
    }
  }

  const dateString = format(nextDoseDate, "yyyy-MM-dd");
  const phrase = formatDatePhrase(nextDoseDate, medication);

  return { date: dateString, phrase };
}
