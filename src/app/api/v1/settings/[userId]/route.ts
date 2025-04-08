import SettingsService from "@/services/settings";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/[userId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const userId = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.UserID);

    const settings = await SettingsService.getSettings(userId);
    return NextResponse.json(settings, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const userId = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.UserID);

    const { helpfulTips, largeFontSize, notifications, parentalControl } =
      await req.json();

    await SettingsService.updateSettings(userId, {
      helpfulTips,
      largeFontSize,
      notifications,
      parentalControl,
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
