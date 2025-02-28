import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import SettingsModel, { Settings, SettingsDocument } from "../models/settings";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../dbConnect";

export default class SettingsDAO {
  static async createNewSettings(
    newSettings: Settings,
  ): Promise<HydratedDocument<SettingsDocument>> {
    await dbConnect();
    try {
      return await SettingsModel.insertOne(newSettings);
    } catch (error) {
      throw new Error(
        "Failed to create user settings: " + (error as Error).message,
      );
    }
  }

  static async getSettingsByUserId(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<SettingsDocument> | null> {
    await dbConnect();
    return await SettingsModel.findOne({ userId });
  }

  static async updateSettingsByUserId(
    userId: Types.ObjectId,
    updateObj: UpdateSettingsRequestBody | UpdateSettingsPinRequestBody,
  ) {
    await dbConnect();
    const result = await SettingsModel.updateOne({ userId }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error("Failed to update user settings.");
    }
  }
}
