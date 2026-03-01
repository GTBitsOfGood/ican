import { Document, model, models, Schema, Types } from "mongoose";

export const NOTIFICATION_TYPES = ["early", "on_time", "missed"] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

export interface Notification {
  userId: Types.ObjectId;
  medicationId: Types.ObjectId;
  type: NotificationType;
  scheduledTime: Date;
  message: string;
  delivered: boolean;
  emailSent: boolean;
}

export interface NotificationDocument extends Notification, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<NotificationDocument>(
  {
    userId: {
      type: Schema.ObjectId,
      required: true,
      index: true,
      ref: "User",
      immutable: true,
    },
    medicationId: {
      type: Schema.ObjectId,
      required: true,
      ref: "Medication",
      immutable: true,
    },
    type: {
      type: String,
      required: true,
      enum: NOTIFICATION_TYPES,
    },
    scheduledTime: { type: Date, required: true },
    message: { type: String, required: true },
    delivered: { type: Boolean, default: false },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true },
);

notificationSchema.index(
  { medicationId: 1, scheduledTime: 1, type: 1 },
  { unique: true },
);

const NotificationModel =
  models.Notification ||
  model<NotificationDocument>("Notification", notificationSchema);

export default NotificationModel;
