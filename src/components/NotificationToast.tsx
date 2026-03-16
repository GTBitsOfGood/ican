import React from "react";
import toast, { Toast } from "react-hot-toast";
import { NotificationType } from "@/db/models/notification";

interface NotificationToastProps {
  t: Toast;
  type: NotificationType;
  message: string;
}

export default function NotificationToast({
  t,
  type,
  message,
}: NotificationToastProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-full border-2 border-[#7177AC] bg-icanBlue-200 font-quantico text-white text-sm max-w-md shadow-lg transition-opacity ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <span className="text-iCAN-Green text-lg font-bold shrink-0">ⓘ</span>
      <p className="flex-1 leading-snug">{formatMessage(type, message)}</p>
      <button
        onClick={() => toast.dismiss(t.id)}
        className="font-pixelify text-iCAN-Green text-2xl leading-none shrink-0 hover:opacity-80"
      >
        x
      </button>
    </div>
  );
}

function formatMessage(
  type: NotificationType,
  message: string,
): React.ReactNode {
  switch (type) {
    case "early": {
      const match = message.match(/^(.+medication\s)(.+?)(\sis coming up.+)$/);
      if (!match) return message;
      return (
        <>
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
        </>
      );
    }
    case "on_time": {
      const match = message.match(/^(.+medication\s)(.+)(!)$/);
      if (!match) return message;
      return (
        <>
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
        </>
      );
    }
    case "missed": {
      const match = message.match(/^(.+)(missed)(.+\s)(.+?)(\sdose.+)$/);
      if (!match) return message;
      return (
        <>
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
          <strong>{match[4]}</strong>
          {match[5]}
        </>
      );
    }
  }
}
