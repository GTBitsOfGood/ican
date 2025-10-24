import SettingsService from "@/services/settings";
import JWTService from "@/services/jwt";
import { verifyUser } from "@/utils/auth";
import { verifyParentalMode } from "@/utils/parentalControl";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";

const route = "/api/v1/settings/pin/[userId]";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenUser = await validateRoutes(req, req.method, route, authToken);
    const userId = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const settings = await SettingsService.getSettings(userId);
    // need this check for onboarding to work as expected
    if (settings.pin !== null) {
      const tokenPayload = JWTService.verifyToken(authToken!);
      verifyParentalMode(tokenPayload);
    }

    const { pin } = await req.json();
    const { tokenReissue } = await SettingsService.updatePin(userId, pin);
    const response = new NextResponse(null, { status: 204 });

    if (tokenReissue) {
      const settings = await SettingsService.getSettings(userId);

      const fiveMinutes = Date.now() + 5 * 60 * 1000;

      const newToken = JWTService.generateToken(
        {
          userId,
          parentalControls: !!settings.pin,
          parentalModeExpiresAt: fiveMinutes,
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

export async function POST(
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

    const { pin } = await req.json();
    await SettingsService.validatePin(userId, pin);

    const newToken = await AuthService.enableParentalMode(userId);

    const nextResponse = new NextResponse(null, { status: 204 });
    const response = generateAPIAuthCookie(nextResponse, newToken);

    return response;
  } catch (err) {
    return handleError(err);
  }
}
