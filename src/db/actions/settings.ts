import { InternalServerError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import client from "../dbClient";
import { UpdateSettingsObject } from "@/types/settings";
import { Settings } from "../models";

export async function crateNewSettings(newSettings: Settings) {
  const db = client.db();

  try {
    await db.collection("settings").insertOne(newSettings);
  } catch (error) {
    throw new InternalServerError(
      "Failed to create user settings: " + (error as Error).message,
    );
  }
}

export async function getSettingsByUserId(userId: ObjectId) {
  const db = client.db();
  const settings = await db.collection("settings").findOne({ userId: userId });

  return settings;
}

export async function updateSettingsByUserId(
  userId: ObjectId,
  updateObj: UpdateSettingsObject,
) {
  const db = client.db();
  const result = await db
    .collection("settings")
    .updateOne({ userId }, { $set: { updateObj } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update user settings.");
  }
}

export async function deletePetByUserId(userId: ObjectId) {
  const db = client.db();
  const result = await db.collection("settings").deleteOne({ userId: userId });

  if (result.deletedCount == 0) {
    throw new InternalServerError("Failed to delete user settings.");
  }
}
