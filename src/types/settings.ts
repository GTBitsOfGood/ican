import { ObjectId } from "mongodb";

// used to define update object for mongodb
export interface UpdateSettingsRequestBody {
  parentalControl?: boolean;
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
}

export interface UpdateSettingsBody extends UpdateSettingsRequestBody {
  userId: ObjectId;
}

export type UpdateSettingsPinRequestBody = {
  pin: string;
};
