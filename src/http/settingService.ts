import { Settings } from "@/db/models";
import fetchService from "./fetchService";
import {
  UpdateSettingsObject,
  UpdateSettingsPinObject,
} from "@/types/settings";

export const settingService = {
  getSettings: async (userId: string): Promise<Settings> => {
    return fetchService<Settings>(`/settings/${userId}`, { method: "GET" });
  },

  updateSettings: async (
    userId: string,
    parentalControl?: boolean,
    notifications?: boolean,
    helpfulTips?: boolean,
    largeFontSize?: boolean,
  ) => {
    const updateSettingsRequestBody: UpdateSettingsObject = {
      parentalControl,
      notifications,
      helpfulTips,
      largeFontSize,
    };
    return fetchService<void>(`/settings/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updateSettingsRequestBody),
    });
  },

  updatePin: async (userId: string, pin: string) => {
    const updatePinRequestBody: UpdateSettingsPinObject = {
      pin,
    };
    return fetchService<void>(`/settings/pin/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePinRequestBody),
    });
  },
};
