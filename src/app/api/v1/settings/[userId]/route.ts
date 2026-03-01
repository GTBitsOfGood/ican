import { cacheControlMiddleware } from "@/middleware/cache-control";
import SettingsService from "@/services/settings";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const settings = await SettingsService.getSettings(userId);
    const headers = cacheControlMiddleware(req);

    return NextResponse.json(settings, { status: 200, headers });
  },
);

export const PATCH = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);
    const {
      helpfulTips,
      largeFontSize,
      notifications,
      notificationPreferences,
    } = await req.json();

    await SettingsService.updateSettings(userId, {
      helpfulTips,
      largeFontSize,
      notifications,
      notificationPreferences,
    });

    return new NextResponse(null, { status: 204 });
  },
);
