import {
  createNewSettings,
  getSettingsByUserId,
  updateSettingsByUserId,
  updateSettingsPinByUserId,
} from "@/db/actions/settings";
import { Settings } from "@/db/models";
import {
  AlreadyExistsError,
  DoesNotExistError,
  InternalServerError,
} from "@/types/exceptions";
import { UpdateSettingsObject } from "@/types/settings";
import { encryptPin, validateParams } from "@/utils/settings";
import { ObjectId } from "mongodb";

export interface CreateSettingsBody {
  userId: string;
}

export interface GetSettingsBody {
  userId: string;
}

export interface UpdateSettingsBody {
  userId: string;
  parentalControl?: boolean;
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
}

export interface UpdateSettingsPinBody {
  userId: string;
  pin: string;
}

export async function createSettings({ userId }: CreateSettingsBody) {
  // Validate parameters
  await validateParams(userId);

  const existingSettings = await getSettingsByUserId(new ObjectId(userId));

  if (existingSettings) {
    throw new AlreadyExistsError("Settings already exists for this user");
  }

  const newSettings: Settings = {
    userId: new ObjectId(userId),
    helpfulTips: true,
    largeFontSize: true,
    notifications: true,
    parentalControl: true,
    pin: "0000",
  };

  const settings = await createNewSettings(newSettings);

  if (!settings) {
    throw new InternalServerError("There was an error making settings.");
  }

  return settings as Settings;
}

export async function getSettings({
  userId,
}: GetSettingsBody): Promise<Settings | null> {
  // Validate parameters
  await validateParams(userId);

  const settings = await getSettingsByUserId(new ObjectId(userId));

  if (!settings) {
    throw new DoesNotExistError("Settings does not exist for this user");
  }

  return settings as Settings;
}

export async function updateSettings({
  userId,
  parentalControl,
  notifications,
  helpfulTips,
  largeFontSize,
}: UpdateSettingsBody): Promise<void> {
  // Validate parameters
  await validateParams(userId);

  const settings = await getSettingsByUserId(new ObjectId(userId));

  if (!settings) {
    throw new DoesNotExistError("Settings does not exist for this user");
  }

  const updateObj: UpdateSettingsObject = {};

  if (parentalControl) updateObj.parentalControl = parentalControl;

  if (notifications) updateObj.notifications = notifications;

  if (helpfulTips) updateObj.helpfulTips = helpfulTips;

  if (largeFontSize) updateObj.largeFontSize = largeFontSize;

  await updateSettingsByUserId(new ObjectId(userId), updateObj);
}

export async function updatePin({ userId, pin }: UpdateSettingsPinBody) {
  await validateParams(userId);

  if (pin) {
    pin = await encryptPin(pin);
    await updateSettingsPinByUserId(new ObjectId(userId), { pin });
  }
}
