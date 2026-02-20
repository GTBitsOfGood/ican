import NotificationService from "@/services/notification";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth<{ notificationId: string }>(
  async (
    _req: NextRequest,
    { params }: { params: { notificationId: string } },
    user: UserDocument,
  ) => {
    await NotificationService.markDelivered(
      params.notificationId,
      user._id.toString(),
    );
    return new NextResponse(null, { status: 204 });
  },
);
