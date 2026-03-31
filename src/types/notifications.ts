export const NOTIFICATION_TYPES = [
  "early",
  "on_time",
  "missed",
  "streak_warning",
] as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[number];
