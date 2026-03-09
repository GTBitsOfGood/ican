import { useEffect } from "react";
import Ably from "ably";
import toast from "react-hot-toast";
import NotificationHTTPClient from "@/http/notificationHTTPClient";
import { NotificationType } from "@/db/models/notification";

interface NotificationMessage {
  notificationId: string;
  type: NotificationType;
  medicationName: string;
  message: string;
  scheduledTime: string;
}

const TOAST_STYLE_MAP = {
  early: { icon: "\u23F0", duration: 8000 },
  on_time: { icon: "\u{1F48A}", duration: 10000 },
  missed: { icon: "\u26A0\uFE0F", duration: 12000 },
} as const;

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
      const style = TOAST_STYLE_MAP[data.type];

      toast(data.message, {
        icon: style.icon,
        duration: style.duration,
        position: "top-right",
        className:
          "font-quantico rounded-xl border-2 border-icanBlue-300 bg-icanBlue-200 text-white",
      });

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
