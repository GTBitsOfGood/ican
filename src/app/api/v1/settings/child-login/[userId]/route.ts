import AuthService from "@/services/auth";
import JWTService from "@/services/jwt";
import SettingsService from "@/services/settings";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { verifyParentalMode } from "@/utils/parentalControl";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/child-login/[userId]";

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
    if (settings.pin !== null && authToken) {
      const tokenPayload = JWTService.verifyToken(authToken);
      verifyParentalMode(tokenPayload);
    }

    const { childPassword, childPasswordType } = await req.json();
    await AuthService.updateChildLogin(
      userId,
      childPassword,
      childPasswordType,
    );

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
