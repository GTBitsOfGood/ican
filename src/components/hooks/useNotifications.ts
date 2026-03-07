import { useEffect } from "react";
import Ably from "ably";
import toast from "react-hot-toast";
import NotificationHTTPClient from "@/http/notificationHTTPClient";
import NotificationToast from "@/components/NotificationToast";
import { NotificationType } from "@/db/models/notification";

interface NotificationMessage {
  notificationId: string;
  type: NotificationType;
  medicationName: string;
  message: string;
  scheduledTime: string;
}

const TOAST_DURATION: Record<NotificationType, number> = {
  early: 8000,
  on_time: 10000,
  missed: 12000,
};

export function useNotifications(userId: string | null) {
  useEffect(() => {
    if (!userId) return;

    const client = new Ably.Realtime({
      authUrl: "/api/v1/notifications/ably-token",
      authMethod: "GET",
    });

    const env = process.env.NODE_ENV || "development";
    const channel = client.channels.get(`notifications:${env}:${userId}`);

    channel.subscribe("medication-notification", (message) => {
      const data = message.data as NotificationMessage;

      toast.custom(
        (t) => NotificationToast({ t, type: data.type, message: data.message }),
        { duration: TOAST_DURATION[data.type], position: "top-right" },
      );

      NotificationHTTPClient.markDelivered(data.notificationId).catch(() => {});
    });

    return () => {
      channel.unsubscribe();
      client.close();
    };
  }, [userId]);
}
