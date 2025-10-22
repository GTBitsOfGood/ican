import AuthService from "@/services/auth";
import { verifyUser } from "@/utils/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/parental-mode/[userId]";

export async function DELETE(
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

    const newToken = await AuthService.disableParentalMode(userId);

    const nextResponse = new NextResponse(null, { status: 204 });
    const response = generateAPIAuthCookie(nextResponse, newToken);

    return response;
  } catch (err) {
    return handleError(err);
  }
}
