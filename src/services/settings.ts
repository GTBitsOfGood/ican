import SettingsDAO from "@/db/actions/settings";
import { Settings } from "@/db/models/settings";
import { removeUndefinedKeys } from "@/lib/utils";
import {
  ConflictError,
  InvalidArgumentsError,
  NotFoundError,
} from "@/types/exceptions";
import { UpdateSettingsRequestBody } from "@/types/settings";
import {
  validateCreateSettings,
  validateGetSettings,
  validateUpdatePin,
  validateUpdateSettings,
} from "@/utils/serviceUtils/settingsUtil";
import { validatePins } from "@/utils/settings";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Types } from "mongoose";
import HashingService from "./hashing";

export default class SettingsService {
  static async createSettings(userId: string): Promise<WithId<Settings>> {
    validateCreateSettings({ userId });

    const existingSettings = await SettingsDAO.getSettingsByUserId(userId);
    if (existingSettings) {
      throw new ConflictError(ERRORS.SETTINGS.CONFLICT);
    }

    const newSettings: Settings = {
      userId: new Types.ObjectId(userId),
      helpfulTips: true,
      largeFontSize: true,
      notifications: true,
      parentalControl: true,
      pin: null,
    };
    const settings = await SettingsDAO.createNewSettings(newSettings);
    if (!settings) {
      throw new Error(ERRORS.SETTINGS.FAILURE.CREATE);
    }
    return { ...settings.toObject(), _id: settings._id.toString() };
  }

  static async getSettings(userId: string): Promise<WithId<Settings>> {
    validateGetSettings({ userId });
    const settings = await SettingsDAO.getSettingsByUserId(userId);

    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }
    return { ...settings.toObject(), _id: settings._id.toString() };
  }

  // Seperated variables concerning query vs body
  static async updateSettings(
    userIdString: string,
    updatedSettings: UpdateSettingsRequestBody,
  ): Promise<{ tokenReissue: boolean }> {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    const validatedSettings = validateUpdateSettings({
      userId: userIdString,
      ...updatedSettings,
    });
    const settings = await SettingsDAO.getSettingsByUserId(userIdString);
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }

    await SettingsDAO.updateSettingsByUserId(userIdString, {
      ...validatedSettings,
    });

    return {
      tokenReissue:
        validatedSettings.parentalControl !== undefined &&
        validatedSettings.parentalControl !== settings.parentalControl,
    };
  }

  /** throws on invalid pin */
  static async validatePin(userId: string, pin: string) {
    const settings = await SettingsDAO.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }
    // check if pin related to userid is the same as the pin inputted
    if (!settings.pin) {
      throw new NotFoundError("Pin is not set");
    }
    if (!(await validatePins(settings.pin, pin))) {
      throw new InvalidArgumentsError("Pin is invalid");
    }
  }

  static async updatePin(userId: string, pin: string) {
    await validateUpdatePin({ userId, pin });
    const settings = await SettingsDAO.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }

    if (pin) {
      if (settings.pin && (await HashingService.compare(pin, settings.pin))) {
        throw new InvalidArgumentsError(ERRORS.SETTINGS.INVALID_ARGUMENTS.PIN);
      }

      const encryptedPin = await HashingService.hash(pin);
      await SettingsDAO.updateSettingsByUserId(userId, {
        pin: encryptedPin,
      });
    }
  }
}
