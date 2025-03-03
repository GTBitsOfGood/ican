import { WithId } from "@/types/models";
import fetchHTTPClient from "./fetchHTTPClient";
import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import { Settings } from "@/db/models/settings";

export default class SettingsHTTPClient {
  static async getSettings(userId: string): Promise<WithId<Settings>> {
    return fetchHTTPClient<WithId<Settings>>(`/settings/${userId}`, {
      method: "GET",
    });
  }

  static async updateSettings(
    userId: string,
    parentalControl?: boolean,
    notifications?: boolean,
    helpfulTips?: boolean,
    largeFontSize?: boolean,
  ) {
    const updateSettingsRequestBody: UpdateSettingsRequestBody = {
      parentalControl,
      notifications,
      helpfulTips,
      largeFontSize,
    };
    return fetchHTTPClient<void>(`/settings/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updateSettingsRequestBody),
    });
  }

  static async updatePin(userId: string, pin: string) {
    const updatePinRequestBody: UpdateSettingsPinRequestBody = {
      pin,
    };
    return fetchHTTPClient<void>(`/settings/pin/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePinRequestBody),
    });
  }
}
