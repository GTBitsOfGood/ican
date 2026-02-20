import { HydratedDocument, Types } from "mongoose";
import NotificationModel, {
  Notification,
  NotificationDocument,
  NotificationType,
} from "../models/notification";
import dbConnect from "../dbConnect";

export default class NotificationDAO {
  static async create(
    notification: Notification,
  ): Promise<HydratedDocument<NotificationDocument>> {
    await dbConnect();
    return await NotificationModel.create(notification);
  }

  static async findById(
    id: string,
  ): Promise<HydratedDocument<NotificationDocument> | null> {
    await dbConnect();
    return await NotificationModel.findById(new Types.ObjectId(id));
  }

  static async markDelivered(id: string): Promise<void> {
    await dbConnect();
    await NotificationModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { delivered: true } },
    );
  }

  static async markEmailSent(id: string): Promise<void> {
    await dbConnect();
    await NotificationModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { emailSent: true } },
    );
  }

  static async findUndelivered(
    olderThanSeconds: number,
  ): Promise<HydratedDocument<NotificationDocument>[]> {
    await dbConnect();
    const cutoff = new Date(Date.now() - olderThanSeconds * 1000);
    return await NotificationModel.find({
      delivered: false,
      emailSent: false,
      createdAt: { $lte: cutoff },
    });
  }

  static async exists(
    medicationId: string,
    scheduledTime: Date,
    type: NotificationType,
  ): Promise<boolean> {
    await dbConnect();
    const doc = await NotificationModel.findOne({
      medicationId: new Types.ObjectId(medicationId),
      scheduledTime,
      type,
    });
    return !!doc;
  }
}
