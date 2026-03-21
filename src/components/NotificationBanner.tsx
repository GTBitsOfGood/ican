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
        <p className="text-[1.1rem] mb-1 leading-none text-[var(--color-teal)]">
          broken streak
        </p>
      )}

      <div
        className={`flex gap-2.5 px-3 py-2.5 w-80 bg-[var(--color-lavender)] border border-solid border-[var(--color-lavender-border)] text-[var(--color-navy)] ${
          isStreak ? "items-start" : "items-center"
        }`}
      >
        <span className="text-sm shrink-0 leading-tight text-icanBlue-200">
          ⓘ
        </span>

        <div className="flex-1 min-w-0 text-xs leading-tight">
          {formatContent(type, message)}
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          aria-label="Dismiss"
          className="shrink-0 text-xs leading-tight hover:opacity-60 text-[var(--color-navy)]"
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
          <p className="text-[1.1rem] mt-0.5 opacity-75">{subtitle}</p>
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
