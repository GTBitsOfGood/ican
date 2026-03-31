import { useEffect } from "react";
import Ably from "ably";
import toast from "react-hot-toast";
import NotificationHTTPClient from "@/http/notificationHTTPClient";
import NotificationBanner from "@/components/NotificationBanner";
import type { NotificationType } from "@/types/notifications";

interface NotificationMessage {
  notificationId: string;
  type: NotificationType;
  medicationName: string;
  message: string;
  scheduledTime: string;
  streakDays?: number;
}

const TOAST_DURATION: Record<NotificationType, number> = {
  early: 8000,
  on_time: 10000,
  missed: 12000,
  streak_warning: 14000,
};

export function useNotifications(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    const client = new Ably.Realtime({
      authUrl: "/api/v1/notifications/ably-token",
      authMethod: "GET",
    });
    let isCleaningUp = false;

    const env = process.env.NODE_ENV || "development";
    const channel = client.channels.get(`notifications:${env}:${userId}`);

    const onMedicationNotification = (message: Ably.Message) => {
      const data = message.data as NotificationMessage;

      toast.custom(
        (t) => (
          <NotificationBanner t={t} type={data.type} message={data.message} />
        ),
        { duration: TOAST_DURATION[data.type], position: "top-center" },
      );

      NotificationHTTPClient.markDelivered(data.notificationId).catch(() => {});
    };

    void channel
      .subscribe("medication-notification", onMedicationNotification)
      .catch((error) => {
        if (isCleaningUp) return;
        const message =
          error instanceof Error ? error.message.toLowerCase() : "";
        if (message.includes("connection closed")) return;
        console.error("Failed to subscribe to notifications:", error);
      });

    return () => {
      isCleaningUp = true;
      channel.unsubscribe("medication-notification", onMedicationNotification);
      client.close();
    };
  }, [userId]);
}
