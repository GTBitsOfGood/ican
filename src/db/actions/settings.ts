import {
  UpdateSettingsRequestBody,
  UpdateSettingsPinRequestBody,
} from "@/types/settings";
import SettingsModel, { Settings, SettingsDocument } from "../models/settings";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

export default class SettingsDAO {
  static async createNewSettings(
    newSettings: Settings,
  ): Promise<HydratedDocument<SettingsDocument>> {
    await dbConnect();
    return await SettingsModel.insertOne(newSettings);
  }

  static async getSettingsByUserId(
    _userId: string | Types.ObjectId,
  ): Promise<HydratedDocument<SettingsDocument> | null> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    return await SettingsModel.findOne({ userId });
  }

  static async updateSettingsByUserId(
    _userId: string | Types.ObjectId,
    updateObj: UpdateSettingsRequestBody | UpdateSettingsPinRequestBody,
  ) {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    const result = await SettingsModel.updateOne({ userId }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.SETTINGS.FAILURE.UPDATE);
    }
  }
}
