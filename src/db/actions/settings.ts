import { InternalServerError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import client from "../dbClient";
import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import { Settings } from "../models";

export async function createNewSettings(newSettings: Settings) {
  const db = client.db();

  try {
    const settings = await db.collection("settings").insertOne(newSettings);

    return settings;
  } catch (error) {
    throw new InternalServerError(
      "Failed to create user settings: " + (error as Error).message,
    );
  }
}

export async function getSettingsByUserId(
  userId: ObjectId,
): Promise<Settings | null> {
  const db = client.db();
  const settings = await db.collection("settings").findOne({ userId: userId });

  return settings as Settings | null;
}

export async function updateSettingsByUserId(
  userId: ObjectId,
  updateObj: UpdateSettingsRequestBody,
) {
  const db = client.db();
  const result = await db
    .collection("settings")
    .updateOne({ userId }, { $set: { ...updateObj } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update user settings.");
  }
}

export async function updateSettingsPinByUserId(
  userId: ObjectId,
  updateObj: UpdateSettingsPinRequestBody,
) {
  const db = client.db();
  const result = await db
    .collection("settings")
    .updateOne({ userId }, { $set: { ...updateObj } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update user settings pin.");
  }
}
