// used to define update object for mongodb
export type UpdateSettingsRequestBody = {
  userId?: string;
  parentalControl?: boolean;
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
};

export type UpdateSettingsPinRequestBody = {
  pin: string;
};
