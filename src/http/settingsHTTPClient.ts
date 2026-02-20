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
      credentials: "include",
    });
  }

  static async updateSettings(userId: string, body: UpdateSettingsRequestBody) {
    return fetchHTTPClient<void>(`/settings/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      credentials: "include",
    });
  }

  static async validatePin(userId: string, pin: string) {
    const validatePinRequestBody: UpdateSettingsPinRequestBody = {
      pin,
    };
    return fetchHTTPClient<void>(`/settings/pin/${userId}`, {
      method: "POST",
      body: JSON.stringify(validatePinRequestBody),
      credentials: "include",
    });
  }

  static async updatePin(userId: string, pin: string | null) {
    const updatePinRequestBody: UpdateSettingsPinRequestBody = {
      pin,
    };
    return fetchHTTPClient<void>(`/settings/pin/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePinRequestBody),
      credentials: "include",
    });
  }

  static async exitParentalMode(userId: string) {
    return fetchHTTPClient<void>(`/settings/parental-mode/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
}
