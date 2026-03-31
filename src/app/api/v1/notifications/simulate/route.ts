import { withAuth } from "@/utils/withAuth";
import { publishToUser } from "@/lib/ably";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";
import { Types } from "mongoose";
import { NOTIFICATION_TYPES } from "@/types/notifications";
import type { NotificationType } from "@/types/notifications";
import {
  buildMedicationNotificationMessage,
  buildStreakWarningMessage,
  getPreferredNotificationName,
} from "@/utils/notificationMessages";

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
    };

    const type: NotificationType = NOTIFICATION_TYPES.includes(
      body.type as NotificationType,
    )
      ? (body.type as NotificationType)
      : "on_time";

    const userId = user._id.toString();
    const userName = getPreferredNotificationName(user.name);
    const message =
      body.message ??
      (type === "streak_warning"
        ? buildStreakWarningMessage()
        : buildMedicationNotificationMessage({
            type,
            userName,
            medicationName: "TestMed",
            earlyWindowMinutes: 5,
            missedWindowMinutes: 15,
          }));

    await publishToUser(userId, "medication-notification", {
      notificationId: new Types.ObjectId().toString(),
      type,
      medicationName: "TestMed",
      message,
      scheduledTime: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true, type, message });
  },
);
