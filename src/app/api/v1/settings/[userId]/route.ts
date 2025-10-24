import { cacheControlMiddleware } from "@/middleware/cache-control";
import SettingsService from "@/services/settings";
import { verifyUser } from "@/utils/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import JWTService from "@/services/jwt";

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
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const settings = await SettingsService.getSettings(userId);
    const headers = cacheControlMiddleware(req);

    return NextResponse.json(settings, { status: 200, headers });
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
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const { helpfulTips, largeFontSize, notifications, parentalControl } =
      await req.json();

    const { tokenReissue } = await SettingsService.updateSettings(userId, {
      helpfulTips,
      largeFontSize,
      notifications,
      parentalControl,
    });

    const response = new NextResponse(null, { status: 204 });

    if (tokenReissue) {
      const settings = await SettingsService.getSettings(userId);

      const newToken = JWTService.generateToken(
        {
          userId,
          parentalControls: !!settings.pin,
          parentalModeExpiresAt: 0,
          origin: "login",
        },
        "90d",
      );

      await generateAPIAuthCookie(response, newToken);
    }

    return response;
  } catch (err) {
    return handleError(err);
  }
}
