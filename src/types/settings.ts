// used to define update object for mongodb
export type UpdateSettingsObject = {
  parentalControl?: boolean;
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
};

export type UpdateSettingsPinObject = {
  pin: string;
};
