import React from "react";
import toast, { Toast } from "react-hot-toast";
import type { NotificationType } from "@/types/notifications";

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
  return (
    <div
      className={`font-quantico transition-opacity ${
        t.visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex w-[min(34rem,calc(100vw-2rem))] overflow-hidden border border-[#aeb2e6] bg-[#c3c6f7] text-[var(--color-navy)] shadow-[0_4px_14px_rgba(44,49,104,0.28)]">
        <div className="w-3 shrink-0 bg-[#7278b5]" />
        <div className="flex min-w-0 flex-1 items-start gap-4 px-4 py-3.5">
          <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#7d83bc] text-[11px] font-bold leading-none text-[#eef0ff]">
            i
          </span>

          <div className="min-w-0 flex-1">{formatContent(type, message)}</div>
        </div>

        <div className="my-3 w-px shrink-0 bg-[#b1b5ea]" />
        <div className="flex items-center px-4">
          <button
            onClick={() => toast.dismiss(t.id)}
            aria-label="Dismiss"
            className="shrink-0 text-[2rem] leading-none text-[var(--color-navy)] hover:opacity-60"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function formatContent(
  type: NotificationType,
  message: string,
): React.ReactNode {
  if (type === "streak_warning") {
    return (
      <>
        <p className="text-[1.15rem] font-bold leading-tight">
          Your medication streak is going to end
        </p>
        <p className="mt-1 text-[0.98rem] leading-tight">
          Take your next dose to not lose it
        </p>
      </>
    );
  }

  switch (type) {
    case "early":
    case "on_time": {
      const match = message.match(
        /^(Hi .+! Time for your )(.+?)( in \d+ minutes?)?$/,
      );
      if (!match)
        return <p className="text-[1.08rem] leading-snug">{message}</p>;
      return (
        <p className="text-[1.08rem] leading-snug">
          {match[1]}
          <strong>{match[2]}</strong>
          {match[3]}
        </p>
      );
    }
    case "missed": {
      const match = message.match(
        /^(Looks like you )(missed your )(.+?)( \d+ minutes? ago)$/,
      );
      if (!match)
        return <p className="text-[1.08rem] leading-snug">{message}</p>;
      return (
        <p className="text-[1.08rem] leading-snug">
          {match[1]}
          <strong>
            {match[2]}
            {match[3]}
          </strong>
          {match[4]}
        </p>
      );
    }
  }
}
