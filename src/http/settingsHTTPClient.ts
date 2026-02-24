import { WithId } from "@/types/models";
import fetchHTTPClient from "./fetchHTTPClient";
import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import { Settings } from "@/db/models/settings";
import { ChildPasswordType } from "@/types/user";

interface UpdateChildLoginRequestBody {
  childPassword: string;
  childPasswordType: ChildPasswordType;
}

export default class SettingsHTTPClient {
  static async getSettings(userId: string): Promise<WithId<Settings>> {
    return fetchHTTPClient<WithId<Settings>>(`/settings/${userId}`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateSettings(
    userId: string,
    notifications?: boolean,
    helpfulTips?: boolean,
    largeFontSize?: boolean,
  ) {
    const updateSettingsRequestBody: UpdateSettingsRequestBody = {
      notifications,
      helpfulTips,
      largeFontSize,
    };
    return fetchHTTPClient<void>(`/settings/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updateSettingsRequestBody),
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

  static async updateChildLogin(
    userId: string,
    childPassword: string,
    childPasswordType: ChildPasswordType,
  ) {
    const updateChildLoginRequestBody: UpdateChildLoginRequestBody = {
      childPassword,
      childPasswordType,
    };

    return fetchHTTPClient<void>(`/settings/child-login/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updateChildLoginRequestBody),
      credentials: "include",
    });
  }
}
