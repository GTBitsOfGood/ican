import { withAuth } from "@/utils/withAuth";
import { publishToUser } from "@/lib/ably";
import { NOTIFICATION_TYPES, NotificationType } from "@/db/models/notification";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";
import { Types } from "mongoose";

const DEFAULT_MESSAGES: Record<NotificationType, string> = {
  early: "Heads up! Your medication TestMed is coming up at 4:00pm.",
  on_time: "Time to take your medication TestMed!",
  missed: "You missed your TestMed dose scheduled at 3:00pm.",
  streak_warning:
    "Your 5-day streak is at risk! Take your medication before midnight to keep it going.",
};

export const POST = withAuth(
  async (
    req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { error: "Only available in development" },
        { status: 403 },
      );
    }

    const body = (await req.json()) as {
      type?: NotificationType;
      message?: string;
      streakDays?: number;
    };

    const type: NotificationType = NOTIFICATION_TYPES.includes(
      body.type as NotificationType,
    )
      ? (body.type as NotificationType)
      : "on_time";

    const message = body.message ?? DEFAULT_MESSAGES[type];
    const userId = user._id.toString();

    await publishToUser(userId, "medication-notification", {
      notificationId: new Types.ObjectId().toString(),
      type,
      medicationName: "TestMed",
      message,
      scheduledTime: new Date().toISOString(),
      ...(type === "streak_warning" && {
        streakDays: body.streakDays ?? 5,
      }),
    });

    return NextResponse.json({ ok: true, type, message });
  },
);
