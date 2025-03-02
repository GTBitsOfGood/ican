import SettingsDAO from "@/db/actions/settings";
import { Settings } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { UpdateSettingsBody } from "@/types/settings";
import { encryptPin, validateParams } from "@/utils/settings";
import { ObjectId } from "mongodb";

export default class SettingsService {
  static async createSettings(userId: string) {
    await validateParams(userId);
    const existingSettings = await SettingsDAO.getSettingsByUserId(
      new ObjectId(userId),
    );
    if (existingSettings) {
      throw new ConflictError("Settings already exist for this user");
    }

    const newSettings: Settings = {
      _id: new ObjectId(),
      userId: new ObjectId(userId),
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
    return settings;
  }

  static async getSettings(userId: string): Promise<Settings> {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new ObjectId(userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    return settings as Settings;
  }

  static async updateSettings(updatedSettings: UpdateSettingsBody) {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    await validateParams(updatedSettings.userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new ObjectId(updatedSettings.userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    await SettingsDAO.updateSettingsByUserId(
      new ObjectId(updatedSettings.userId),
      updatedSettings,
    );
  }

  static async updatePin(userId: string, pin: string) {
    await validateParams(userId);
    const settings = await SettingsDAO.getSettingsByUserId(
      new ObjectId(userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    if (pin) {
      const encryptedPin = await encryptPin(pin);
      await SettingsDAO.updateSettingsPinByUserId(new ObjectId(userId), {
        pin: encryptedPin,
      });
    }
  }
}
