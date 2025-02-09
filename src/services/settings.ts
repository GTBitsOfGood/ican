import {
  getSettingsByUserId,
  updateSettingsByUserId,
} from "@/db/actions/settings";
import { Settings } from "@/db/models";
import { DoesNotExistError } from "@/types/exceptions";
import { UpdateSettingsObject } from "@/types/settings";
import { validateParams } from "@/utils/settings";
import { ObjectId } from "mongodb";

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
