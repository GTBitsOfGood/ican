import NotificationDAO from "@/db/actions/notification";
import MedicationDAO from "@/db/actions/medication";
import SettingsDAO from "@/db/actions/settings";
import PetDAO from "@/db/actions/pets";
import { publishToUser } from "@/lib/ably";
import {
  shouldScheduleMedication,
  processDoseTime,
} from "@/utils/serviceUtils/medicationUtil";
import {
  buildMedicationNotificationMessage,
  buildStreakWarningMessage,
  getPreferredNotificationName,
  MISSED_NOTIFICATION_DELAY_MINUTES,
  type MedicationNotificationType,
} from "@/utils/notificationMessages";
import { WithId } from "@/types/models";
import { Medication } from "@/db/models/medication";
import UserDAO from "@/db/actions/user";
import { hasActiveStreak } from "@/services/streak";
import { MedicationLogDocument } from "@/db/models/medicationLog";
import { HydratedDocument } from "mongoose";

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

function isSameLocalDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
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

      const user = await UserDAO.getUserFromId(userId);
      const notificationName = getPreferredNotificationName(user?.name);

      const now = new Date();
      const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const logsCache = new Map<
        string,
        HydratedDocument<MedicationLogDocument>[]
      >();
      for (const medication of medications) {
        const logs = await MedicationDAO.getMedicationLogs(
          medication._id.toString(),
        );
        logsCache.set(medication._id.toString(), logs);
      }

      let lastScheduledDate: Date | null = null;
      let lastMedicationId: string | null = null;
      let lastDoseTimeStr: string | null = null;

      for (const medication of medications) {
        const med: WithId<Medication> = {
          ...medication.toObject(),
          _id: medication._id.toString(),
        };
        if (!shouldScheduleMedication(med, today, medication.createdAt))
          continue;

        for (const doseTime of medication.doseTimes) {
          const scheduledDate = parseDoseTimeToDate(doseTime, now);
          if (!lastScheduledDate || scheduledDate > lastScheduledDate) {
            lastScheduledDate = scheduledDate;
            lastMedicationId = med._id;
            lastDoseTimeStr = doseTime;
          }
        }
      }

      const hasTakenMedToday = [...logsCache.values()].some((logs) =>
        logs.some((log) => isSameLocalDay(new Date(log.dateTaken), today)),
      );

      const pet = await PetDAO.getPetByUserId(userId);
      const petWithId = pet
        ? { ...pet.toObject(), _id: pet._id.toString() }
        : null;
      const shouldCheckStreak =
        petWithId &&
        hasActiveStreak(petWithId) &&
        !hasTakenMedToday &&
        lastScheduledDate !== null;

      for (const medication of medications) {
        const med: WithId<Medication> = {
          ...medication.toObject(),
          _id: medication._id.toString(),
        };

        if (!shouldScheduleMedication(med, today, medication.createdAt)) {
          continue;
        }

        const medicationLogs = logsCache.get(med._id) ?? [];

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
            type: MedicationNotificationType;
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
              condition:
                diffMinutes >= MISSED_NOTIFICATION_DELAY_MINUTES &&
                diffMinutes < MISSED_NOTIFICATION_DELAY_MINUTES + 1,
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

            const message = buildMedicationNotificationMessage({
              type,
              userName: notificationName,
              medicationName: medication.customMedicationId,
              earlyWindowMinutes: prefs.earlyWindow,
            });

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

            const isLastDose =
              med._id === lastMedicationId && doseTime === lastDoseTimeStr;

            if (
              shouldCheckStreak &&
              isLastDose &&
              petWithId &&
              prefs.types.includes("streak_warning")
            ) {
              const streakWarningExists = await NotificationDAO.exists(
                med._id,
                scheduledDate,
                "streak_warning",
              );

              if (!streakWarningExists) {
                const streakMessage = buildStreakWarningMessage();

                const streakNotification = await NotificationDAO.create({
                  userId: medication.userId,
                  medicationId: medication._id,
                  type: "streak_warning",
                  scheduledTime: scheduledDate,
                  message: streakMessage,
                  delivered: false,
                  emailSent: false,
                });

                if (prefs.realTimeEnabled) {
                  await publishToUser(userId, "medication-notification", {
                    notificationId: streakNotification._id.toString(),
                    type: "streak_warning",
                    medicationName: medication.customMedicationId,
                    message: streakMessage,
                    scheduledTime: scheduledDate.toISOString(),
                  });
                }

                sentCount++;
              }
            }
          }
        }
      }
    }

    return sentCount;
  }

  static async checkAndSendEmailFallbacks(
    sendEmail: (to: string, subject: string, html: string) => Promise<boolean>,
  ): Promise<number> {
    const undelivered = await NotificationDAO.findUndelivered(30);
    let emailCount = 0;

    for (const notification of undelivered) {
      const settings = await SettingsDAO.getSettingsByUserId(
        notification.userId,
      );
      if (!settings?.notificationPreferences?.emailEnabled) continue;

      const user = await UserDAO.getUserFromId(notification.userId.toString());
      if (!user?.email) continue;

      await sendEmail(
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
