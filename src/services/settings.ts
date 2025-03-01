import SettingsDAO from "@/db/actions/settings";
import { Settings } from "@/db/models/settings";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { WithId } from "@/types/models";
import { UpdateSettingsBody } from "@/types/settings";
import { encryptPin, validateParams } from "@/utils/settings";
import { Types } from "mongoose";

export default class SettingsService {
  static async createSettings(userId: string): Promise<WithId<Settings>> {
    await validateParams(userId);
    const existingSettings = await SettingsDAO.getSettingsByUserId(
      new Types.ObjectId(userId),
    );
    if (existingSettings) {
      throw new ConflictError("Settings already exist for this user");
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
      throw new Error("There was an error creating settings.");
    }
    return settings.toObject();
  }

  static async getSettings(userId: string): Promise<WithId<Settings>> {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new Types.ObjectId(userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    return settings.toObject();
  }

  static async updateSettings(
    updatedSettings: UpdateSettingsBody,
  ): Promise<void> {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    await validateParams(updatedSettings.userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new Types.ObjectId(updatedSettings.userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    await SettingsDAO.updateSettingsByUserId(
      new Types.ObjectId(updatedSettings.userId),
      updatedSettings,
    );
  }

  static async updatePin(userId: string, pin: string): Promise<void> {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new Types.ObjectId(userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    if (pin) {
      const encryptedPin = await encryptPin(pin);
      await SettingsDAO.updateSettingsByUserId(new Types.ObjectId(userId), {
        pin: encryptedPin,
      });
    }
  }
}
