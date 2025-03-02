import SettingsDAO from "@/db/actions/settings";
import { Settings } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { UpdateSettingsRequestBody } from "@/types/settings";
import {
  validateCreateSettings,
  validateGetSettings,
  validateUpdatePin,
  validateUpdateSettings,
} from "@/utils/serviceUtils/settingsUtil";
import { encryptPin } from "@/utils/settings";
import { ObjectId } from "mongodb";

export default class SettingsService {
  static async createSettings(userId: string) {
    validateCreateSettings({ userId });
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
    validateGetSettings({ userId });
    const settings = await SettingsDAO.getSettingsByUserId(
      new ObjectId(userId),
    );
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    return settings as Settings;
  }

  // Seperated variables concerning query vs body
  static async updateSettings(
    userIdString: string,
    updatedSettings: UpdateSettingsRequestBody,
  ) {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    // Or should we just let it throw an error for this case?
    // if (Object.keys(updatedSettings).length === 0) {
    //   // Return early if no settings to update
    //   return;
    // }
    const validatedSettings = validateUpdateSettings({
      userId: userIdString,
      ...updatedSettings,
    });
    const userId = new ObjectId(validatedSettings.userId);
    const settings = await SettingsDAO.getSettingsByUserId(userId);
    if (!settings) {
      throw new NotFoundError("Settings do not exist for this user");
    }
    await SettingsDAO.updateSettingsByUserId(userId, {
      ...validatedSettings,
      userId, // Replaces the string userId with the objectId
    });
  }

  static async updatePin(userId: string, pin: string) {
    await validateUpdatePin({ userId });
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
