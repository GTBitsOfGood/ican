import { ObjectId } from "mongodb";

export interface UpdateNotificationPreferencesBody {
  types?: ("early" | "on_time" | "missed")[];
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
