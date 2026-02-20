import { Document, model, models, Schema, Types } from "mongoose";
import { NotificationType } from "./notification";

export interface NotificationPreferences {
  types: NotificationType[];
  earlyWindow: number;
  emailEnabled: boolean;
  realTimeEnabled: boolean;
}

export interface Settings {
  userId: Types.ObjectId;
  notifications: boolean;
  helpfulTips: boolean;
  largeFontSize: boolean;
  pin: string | null;
  notificationPreferences: NotificationPreferences;
}

export interface SettingsDocument extends Settings, Document {
  _id: Types.ObjectId;
}

const notificationPreferencesSchema = new Schema(
  {
    types: {
      type: [String],
      enum: ["early", "on_time", "missed"],
      default: ["early", "on_time", "missed"],
    },
    earlyWindow: { type: Number, default: 15 },
    emailEnabled: { type: Boolean, default: true },
    realTimeEnabled: { type: Boolean, default: true },
  },
  { _id: false },
);

const settingsSchema = new Schema<SettingsDocument>(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      index: true,
      ref: "User",
      immutable: true,
    },
    notifications: { type: Boolean, required: true },
    helpfulTips: { type: Boolean, required: true },
    largeFontSize: { type: Boolean, required: true },
    pin: { type: String, required: false },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({
        types: ["early", "on_time", "missed"],
        earlyWindow: 15,
        emailEnabled: true,
        realTimeEnabled: true,
      }),
    },
  },
  { timestamps: true },
);

const SettingsModel =
  models.Settings || model<SettingsDocument>("Settings", settingsSchema);

export default SettingsModel;
