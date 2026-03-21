import React from "react";
import toast, { Toast } from "react-hot-toast";
import { NotificationType } from "@/db/models/notification";

interface NotificationBannerProps {
  t: Toast;
  type: NotificationType;
  message: string;
}

export default function NotificationBanner({
  t,
  type,
  message,
}: NotificationBannerProps) {
  const isStreak = type === "streak_warning";

  return (
    <div
      className={`flex flex-col font-quantico transition-opacity ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {isStreak && (
        <p
          className="text-[11px] mb-1 leading-none"
          style={{ color: "#4DBDBA" }}
        >
          broken streak
        </p>
      )}

      <div
        className={`flex gap-2.5 px-3 py-2.5 w-80 ${
          isStreak ? "items-start" : "items-center"
        }`}
        style={{
          backgroundColor: "#B7BDEF",
          border: "1px solid #9DA4D5",
          color: "#1E2353",
        }}
      >
        <span
          className="text-sm shrink-0 leading-tight"
          style={{ color: "#4C539B" }}
        >
          ⓘ
        </span>

        <div className="flex-1 min-w-0 text-xs leading-tight">
          {formatContent(type, message)}
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss"
          className="shrink-0 text-xs leading-tight hover:opacity-60"
          style={{ color: "#1E2353" }}
        >
          ×
        </button>
      </div>
    </div>
  );
}

function formatContent(
  type: NotificationType,
  message: string,
): React.ReactNode {
  if (type === "streak_warning") {
    const splitIdx = message.indexOf("! ");
    const title = splitIdx !== -1 ? message.slice(0, splitIdx + 1) : message;
    const subtitle = splitIdx !== -1 ? message.slice(splitIdx + 2) : null;
    return (
      <>
        <p className="font-bold text-xs">{title}</p>
        {subtitle && (
          <p className="text-[11px] mt-0.5" style={{ opacity: 0.75 }}>
            {subtitle}
          </p>
        )}
      </>
    );
  }

  switch (type) {
    case "early": {
      const match = message.match(/^(.+medication\s)(.+?)(\sis coming up.+)$/);
      if (!match) return <p className="text-xs">{message}</p>;
      return (
        <p className="text-xs">
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
        </p>
      );
    }
    case "on_time": {
      const match = message.match(/^(.+medication\s)(.+?)(!)$/);
      if (!match) return <p className="text-xs">{message}</p>;
      return (
        <p className="text-xs">
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
        </p>
      );
    }
    case "missed": {
      const match = message.match(/^(.+)(missed)(.+\s)(.+?)(\sdose.+)$/);
      if (!match) return <p className="text-xs">{message}</p>;
      return (
        <p className="text-xs">
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
          <strong>{match[4]}</strong>
          {match[5]}
        </p>
      );
    }
  }
}
