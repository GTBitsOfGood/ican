import { ObjectId } from "mongodb";
import type { NotificationType } from "@/types/notifications";

export interface UpdateNotificationPreferencesBody {
  types?: NotificationType[];
  earlyWindow?: number;
  emailEnabled?: boolean;
  realTimeEnabled?: boolean;
  use24HourTime?: boolean;
}

export interface UpdateSettingsRequestBody {
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
  notificationPreferences?: UpdateNotificationPreferencesBody;
}

export interface UpdateSettingsBody extends UpdateSettingsRequestBody {
  userId: ObjectId;
}

export type UpdateSettingsPinRequestBody = {
  pin: string | null;
};
