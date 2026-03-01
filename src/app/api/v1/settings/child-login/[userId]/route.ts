import AuthService from "@/services/auth";
import SettingsService from "@/services/settings";
import { UserDocument } from "@/db/models/user";
import { JWTPayload } from "@/types/jwt";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";
import { verifyParentalMode } from "@/utils/parentalControl";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

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
    if (settings.pin !== null) {
      verifyParentalMode(tokenPayload);
    }

    const { childPassword, childPasswordType } = await req.json();
    await AuthService.updateChildLogin(
      userId,
      childPassword,
      childPasswordType,
    );

    return new NextResponse(null, { status: 204 });
  },
);
