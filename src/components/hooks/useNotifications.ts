import { useEffect } from "react";
import Ably from "ably";
import toast from "react-hot-toast";
import NotificationHTTPClient from "@/http/notificationHTTPClient";

interface NotificationMessage {
  notificationId: string;
  type: "early" | "on_time" | "missed";
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

    const channel = client.channels.get(`notifications:${userId}`);

    channel.subscribe("medication-notification", (message) => {
      const data = message.data as NotificationMessage;
      const style = TOAST_STYLE_MAP[data.type];

      toast(data.message, {
        icon: style.icon,
        duration: style.duration,
        position: "top-right",
        style: {
          borderRadius: "12px",
          background: "#1a1a2e",
          color: "#fff",
          border: "2px solid #4a90d9",
          fontFamily: "Quantico, sans-serif",
        },
      });

      NotificationHTTPClient.markDelivered(data.notificationId).catch(() => {});
    });

    return () => {
      channel.unsubscribe();
      client.close();
    };
  }, [userId]);
}
