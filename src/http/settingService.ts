import { Settings } from "@/db/models";
import fetchService from "./fetchService";
import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
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
    const updateSettingsRequestBody: UpdateSettingsRequestBody = {
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
    const updatePinRequestBody: UpdateSettingsPinRequestBody = {
      pin,
    };
    return fetchService<void>(`/settings/pin/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePinRequestBody),
    });
  },
};
