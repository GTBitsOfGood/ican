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
import { UpdateSettingsRequestBody } from "@/types/settings";
import { encryptPin, validateParams } from "@/utils/settings";
import { ObjectId } from "mongodb";

export interface CreateSettingsBody {
  userId: string | string[] | undefined;
}

export interface GetSettingsBody {
  userId: string | string[] | undefined;
}

export interface UpdateSettingsBody {
  userId: string | string[] | undefined;
  parentalControl?: boolean;
  notifications?: boolean;
  helpfulTips?: boolean;
  largeFontSize?: boolean;
}

export interface UpdateSettingsPinBody {
  userId: string | string[] | undefined;
  pin: string;
}

export async function createSettings({ userId }: CreateSettingsBody) {
  // Validate parameters
  // every case of underined or invalid type is captured here
  await validateParams(userId);

  const existingSettings = await getSettingsByUserId(
    new ObjectId(userId as string),
  );

  if (existingSettings) {
    throw new AlreadyExistsError("Settings already exists for this user");
  }

  const newSettings: Settings = {
    _id: new ObjectId(),
    userId: new ObjectId(userId as string),
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

  return settings;
}

export async function getSettings({
  userId,
}: GetSettingsBody): Promise<Settings> {
  // Validate parameters
  // every case of underined or invalid type is captured here
  await validateParams(userId);

  const settings = await getSettingsByUserId(new ObjectId(userId as string));

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
  // every case of underined or invalid type is captured here

  await validateParams(userId);

  const settings = await getSettingsByUserId(new ObjectId(userId as string));

  if (!settings) {
    throw new DoesNotExistError("Settings does not exist for this user");
  }

  const updateObj: UpdateSettingsRequestBody = {};

  if (parentalControl !== undefined)
    updateObj.parentalControl = parentalControl;

  if (notifications !== undefined) updateObj.notifications = notifications;

  if (helpfulTips !== undefined) updateObj.helpfulTips = helpfulTips;

  if (largeFontSize !== undefined) updateObj.largeFontSize = largeFontSize;

  await updateSettingsByUserId(new ObjectId(userId as string), updateObj);
}

export async function updatePin({ userId, pin }: UpdateSettingsPinBody) {
  // every case of underined or invalid type is captured here

  await validateParams(userId);

  const settings = await getSettingsByUserId(new ObjectId(userId as string));

  if (!settings) {
    throw new DoesNotExistError("Settings does not exist for this user");
  }

  if (pin) {
    pin = await encryptPin(pin);
    await updateSettingsPinByUserId(new ObjectId(userId as string), { pin });
  }
}
