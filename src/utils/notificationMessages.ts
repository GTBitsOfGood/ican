import type { NotificationType } from "@/types/notifications";

export type MedicationNotificationType = Exclude<
  NotificationType,
  "streak_warning"
>;

export const MISSED_NOTIFICATION_DELAY_MINUTES = 15;

function formatMinuteLabel(minutes: number): string {
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

export function getPreferredNotificationName(name?: string | null): string {
  const trimmedName = name?.trim();
  if (!trimmedName) return "there";
  return trimmedName.split(/\s+/)[0];
}

export function buildMedicationNotificationMessage({
  type,
  userName,
  medicationName,
  earlyWindowMinutes,
  missedWindowMinutes = MISSED_NOTIFICATION_DELAY_MINUTES,
}: {
  type: MedicationNotificationType;
  userName: string;
  medicationName: string;
  earlyWindowMinutes: number;
  missedWindowMinutes?: number;
}): string {
  switch (type) {
    case "early":
      return `Hi ${userName}! Time for your ${medicationName} in ${formatMinuteLabel(earlyWindowMinutes)}`;
    case "on_time":
      return `Hi ${userName}! Time for your ${medicationName}`;
    case "missed":
      return `Looks like you missed your ${medicationName} ${formatMinuteLabel(missedWindowMinutes)} ago`;
  }
}

export function buildStreakWarningMessage(): string {
  return "Your medication streak is going to end. Take your next dose to not lose it.";
}
