import { ObjectId } from "mongodb";
import client from "../dbClient";
import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import { Settings } from "../models";

export default class SettingsDAO {
  static async createNewSettings(newSettings: Settings) {
    const db = client.db();

    try {
      const settings = await db.collection("settings").insertOne(newSettings);

      return settings;
    } catch (error) {
      throw new Error(
        "Failed to create user settings: " + (error as Error).message,
      );
    }
  }

  static async getSettingsByUserId(userId: ObjectId): Promise<Settings | null> {
    const db = client.db();
    const settings = await db
      .collection("settings")
      .findOne({ userId: userId });

    return settings as Settings | null;
  }

  static async updateSettingsByUserId(
    userId: ObjectId,
    updateObj: UpdateSettingsRequestBody,
  ) {
    const db = client.db();
    const result = await db
      .collection("settings")
      .updateOne({ userId }, { $set: { ...updateObj, userId } });

    if (result.modifiedCount == 0) {
      throw new Error("Failed to update user settings.");
    }
  }

  static async updateSettingsPinByUserId(
    userId: ObjectId,
    updateObj: UpdateSettingsPinRequestBody,
  ) {
    const db = client.db();
    const result = await db
      .collection("settings")
      .updateOne({ userId }, { $set: { ...updateObj } });

    if (result.modifiedCount == 0) {
      throw new Error("Failed to update user settings pin.");
    }
  }
}
