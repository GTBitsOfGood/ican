import {
  UpdateNotificationPreferencesBody,
  UpdateSettingsPinRequestBody,
  UpdateSettingsRequestBody,
} from "@/types/settings";
import SettingsModel, { Settings, SettingsDocument } from "../models/settings";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

function flattenNotificationPreferences(
  prefs: UpdateNotificationPreferencesBody,
): Record<string, unknown> {
  const flat: Record<string, unknown> = {};
  if (prefs.types !== undefined)
    flat["notificationPreferences.types"] = prefs.types;
  if (prefs.earlyWindow !== undefined)
    flat["notificationPreferences.earlyWindow"] = prefs.earlyWindow;
  if (prefs.emailEnabled !== undefined)
    flat["notificationPreferences.emailEnabled"] = prefs.emailEnabled;
  if (prefs.realTimeEnabled !== undefined)
    flat["notificationPreferences.realTimeEnabled"] = prefs.realTimeEnabled;
  return flat;
}

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

    const { notificationPreferences, ...rest } =
      updateObj as UpdateSettingsRequestBody;
    const setObj: Record<string, unknown> = { ...rest };

    if (notificationPreferences) {
      Object.assign(
        setObj,
        flattenNotificationPreferences(notificationPreferences),
      );
    }

    const result = await SettingsModel.updateOne({ userId }, { $set: setObj });
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.SETTINGS.FAILURE.UPDATE);
    }
  }

  static async getAllWithNotificationsEnabled(): Promise<
    HydratedDocument<SettingsDocument>[]
  > {
    await dbConnect();
    return await SettingsModel.find({ notifications: true });
  }
}
