import SettingsDAO from "@/db/actions/settings";
import { Settings } from "@/db/models/settings";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { WithId } from "@/types/models";
import { UpdateSettingsBody } from "@/types/settings";
import ERRORS from "@/utils/errorMessages";
import { validateParams } from "@/utils/settings";
import { Types } from "mongoose";
import HashingService from "./hashing";

export default class SettingsService {
  static async createSettings(userId: string): Promise<WithId<Settings>> {
    await validateParams(userId);
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
      pin: "0000",
    };

    const settings = await SettingsDAO.createNewSettings(newSettings);
    if (!settings) {
      throw new Error(ERRORS.SETTINGS.FAILURE.CREATE);
    }
    return { ...settings.toObject(), _id: settings._id.toString() };
  }

  static async getSettings(userId: string): Promise<WithId<Settings>> {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }
    return { ...settings.toObject(), _id: settings._id.toString() };
  }

  static async updateSettings(
    updatedSettings: UpdateSettingsBody,
  ): Promise<void> {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    await validateParams(updatedSettings.userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      updatedSettings.userId as string,
    );
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }
    await SettingsDAO.updateSettingsByUserId(
      updatedSettings.userId as string,
      updatedSettings,
    );
  }

  static async updatePin(userId: string, pin: string): Promise<void> {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND);
    }
    if (pin) {
      const encryptedPin = await HashingService.hash(pin);
      await SettingsDAO.updateSettingsByUserId(userId, {
        pin: encryptedPin,
      });
    }
  }
}
