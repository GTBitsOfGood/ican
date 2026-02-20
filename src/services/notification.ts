import NotificationDAO from "@/db/actions/notification";
import MedicationDAO from "@/db/actions/medication";
import SettingsDAO from "@/db/actions/settings";
import { NotificationType } from "@/db/models/notification";
import { publishToUser } from "@/lib/ably";
import {
  shouldScheduleMedication,
  processDoseTime,
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import { Medication } from "@/db/models/medication";
import EmailService from "./mail";
import UserDAO from "@/db/actions/user";

function buildMessage(
  type: NotificationType,
  medicationName: string,
  time: string,
): string {
  switch (type) {
    case "early":
      return `Heads up! Your medication ${medicationName} is coming up at ${time}.`;
    case "on_time":
      return `Time to take your medication ${medicationName}!`;
    case "missed":
      return `You missed your ${medicationName} dose scheduled at ${time}.`;
  }
}

function parseDoseTimeToDate(doseTime: string, now: Date): Date {
  const [hours, minutes] = doseTime.split(":").map(Number);
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export default class NotificationService {
  static async checkAndSendNotifications(): Promise<number> {
    const allSettings = await SettingsDAO.getAllWithNotificationsEnabled();
    let sentCount = 0;

    for (const settings of allSettings) {
      const userId = settings.userId.toString();
      const prefs = settings.notificationPreferences;
      if (!prefs) continue;

      const medications = await MedicationDAO.getMedicationsByUserId(userId);
      if (medications.length === 0) continue;

      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      for (const medication of medications) {
        const med: WithId<Medication> = {
          ...medication.toObject(),
          _id: medication._id.toString(),
        };

        if (!shouldScheduleMedication(med, today, medication.createdAt)) {
          continue;
        }

        const medicationLogs = await MedicationDAO.getMedicationLogs(med._id);

        for (const doseTime of medication.doseTimes) {
          const scheduledDate = parseDoseTimeToDate(doseTime, now);
          const diffMinutes =
            (now.getTime() - scheduledDate.getTime()) / (1000 * 60);

          const { status } = processDoseTime(
            doseTime,
            dateString,
            medicationLogs,
            now.toISOString(),
          );

          if (status === "taken") continue;

          const typesToCheck: {
            type: NotificationType;
            condition: boolean;
          }[] = [
            {
              type: "early",
              condition:
                diffMinutes >= -prefs.earlyWindow &&
                diffMinutes < -prefs.earlyWindow + 1,
            },
            {
              type: "on_time",
              condition: diffMinutes >= 0 && diffMinutes < 1,
            },
            {
              type: "missed",
              condition: diffMinutes >= 15 && diffMinutes < 16,
            },
          ];

          for (const { type, condition } of typesToCheck) {
            if (!condition) continue;
            if (!prefs.types.includes(type)) continue;

            const alreadyExists = await NotificationDAO.exists(
              med._id,
              scheduledDate,
              type,
            );
            if (alreadyExists) continue;

            const message = buildMessage(
              type,
              medication.customMedicationId,
              doseTime,
            );

            const notification = await NotificationDAO.create({
              userId: medication.userId,
              medicationId: medication._id,
              type,
              scheduledTime: scheduledDate,
              message,
              delivered: false,
              emailSent: false,
            });

            if (prefs.realTimeEnabled) {
              await publishToUser(userId, "medication-notification", {
                notificationId: notification._id.toString(),
                type,
                medicationName: medication.customMedicationId,
                message,
                scheduledTime: scheduledDate.toISOString(),
              });
            }

            sentCount++;
          }
        }
      }
    }

    return sentCount;
  }

  static async checkAndSendEmailFallbacks(): Promise<number> {
    const undelivered = await NotificationDAO.findUndelivered(30);
    let emailCount = 0;

    for (const notification of undelivered) {
      const settings = await SettingsDAO.getSettingsByUserId(
        notification.userId,
      );
      if (!settings?.notificationPreferences?.emailEnabled) continue;

      const user = await UserDAO.getUserFromId(notification.userId.toString());
      if (!user?.email) continue;

      await EmailService.sendEmail(
        user.email,
        "Medication Reminder - iCAN Pill Pal",
        `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Medication Reminder</h2>
          <p>${notification.message}</p>
          <p style="color: #666; font-size: 12px;">
            This email was sent because the real-time notification was not received.
          </p>
        </div>`,
      );

      await NotificationDAO.markEmailSent(notification._id.toString());
      emailCount++;
    }

    return emailCount;
  }

  static async markDelivered(
    notificationId: string,
    userId: string,
  ): Promise<void> {
    const notification = await NotificationDAO.findById(notificationId);
    if (!notification) return;
    if (notification.userId.toString() !== userId) return;
    await NotificationDAO.markDelivered(notificationId);
  }
}
