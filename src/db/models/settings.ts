import { Document, model, models, Schema, Types } from "mongoose";

export interface Settings {
  userId: Types.ObjectId;
  parentalControl: boolean;
  notifications: boolean;
  helpfulTips: boolean;
  largeFontSize: boolean;
  pin: string;
}

export interface SettingsDocument extends Settings, Document {
  _id: Types.ObjectId;
}

const settingsSchema = new Schema<SettingsDocument>(
  {
    userId: { type: Schema.ObjectId, required: true, index: true, ref: "User" },
    parentalControl: { type: Boolean, required: true },
    notifications: { type: Boolean, required: true },
    helpfulTips: { type: Boolean, required: true },
    largeFontSize: { type: Boolean, required: true },
    pin: { type: String, required: true },
  },
  { timestamps: true },
);

const SettingsModel =
  models.Setting || model<SettingsDocument>("Setting", settingsSchema);

export default SettingsModel;
