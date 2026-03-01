import { ObjectId } from "mongodb";
import { NotificationType } from "@/db/models/notification";

export interface UpdateNotificationPreferencesBody {
  types?: NotificationType[];
  earlyWindow?: number;
  emailEnabled?: boolean;
  realTimeEnabled?: boolean;
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
