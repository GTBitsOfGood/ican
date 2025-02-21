import {
  createNewSettings,
  getSettingsByUserId,
  updateSettingsByUserId,
  updateSettingsPinByUserId,
} from "@/db/actions/settings";
import { Settings } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import {
  AlreadyExistsError,
  DoesNotExistError,
  InternalServerError,
} from "@/types/exceptions";
import { UpdateSettingsRequestBody } from "@/types/settings";
import { encryptPin, validateParams } from "@/utils/settings";
import { ObjectId } from "mongodb";

export const settingsService = {
  async createSettings(userId: string) {
    await validateParams(userId);
    const existingSettings = await getSettingsByUserId(new ObjectId(userId));
    if (existingSettings) {
      throw new AlreadyExistsError("Settings already exist for this user");
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

    const settings = await createNewSettings(newSettings);
    if (!settings) {
      throw new InternalServerError("There was an error creating settings.");
    }
    return settings;
  },

  async getSettings(userId: string): Promise<Settings> {
    await validateParams(userId);
    const settings = await getSettingsByUserId(new ObjectId(userId));
    if (!settings) {
      throw new DoesNotExistError("Settings do not exist for this user");
    }
    return settings as Settings;
  },

  async updateSettings(updatedSettings: UpdateSettingsRequestBody) {
    updatedSettings = removeUndefinedKeys(updatedSettings);
    await validateParams(updatedSettings.userId);
    const settings = await getSettingsByUserId(
      new ObjectId(updatedSettings.userId),
    );
    if (!settings) {
      throw new DoesNotExistError("Settings do not exist for this user");
    }
    await updateSettingsByUserId(
      new ObjectId(updatedSettings.userId),
      updatedSettings,
    );
  },

  async updatePin(userId: string, pin: string) {
    await validateParams(userId);
    const settings = await getSettingsByUserId(new ObjectId(userId));
    if (!settings) {
      throw new DoesNotExistError("Settings do not exist for this user");
    }
    if (pin) {
      const encryptedPin = await encryptPin(pin);
      await updateSettingsPinByUserId(new ObjectId(userId), {
        pin: encryptedPin,
      });
    }
  },
};

export default settingsService;
