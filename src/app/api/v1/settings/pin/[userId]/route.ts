import SettingsService from "@/services/settings";
import JWTService from "@/services/jwt";
import { verifyUser } from "@/utils/auth";
import { verifyParentalMode } from "@/utils/parentalControl";
import ERRORS from "@/utils/errorMessages";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { UserDocument } from "@/db/models/user";
import { JWTPayload } from "@/types/jwt";

export const PATCH = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
    tokenPayload: JWTPayload,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const settings = await SettingsService.getSettings(userId);
    // need this check for onboarding to work as expected
    if (settings.pin !== null) {
      verifyParentalMode(tokenPayload);
    }

    const { pin } = await req.json();
    const { tokenReissue } = await SettingsService.updatePin(userId, pin);
    const response = new NextResponse(null, { status: 204 });

    if (tokenReissue) {
      const updatedSettings = await SettingsService.getSettings(userId);

      const fiveMinutes = Date.now() + 5 * 60 * 1000;

      const newToken = JWTService.generateToken(
        {
          userId,
          parentalControls: !!updatedSettings.pin,
          parentalModeExpiresAt: fiveMinutes,
          origin: "login",
        },
        "90d",
      );

      await generateAPIAuthCookie(response, newToken);
    }

    return response;
  },
);

export const POST = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const { pin } = await req.json();
    await SettingsService.validatePin(userId, pin);

    const newToken = await AuthService.enableParentalMode(userId);

    const nextResponse = new NextResponse(null, { status: 204 });

    return await generateAPIAuthCookie(nextResponse, newToken);
  },
);
