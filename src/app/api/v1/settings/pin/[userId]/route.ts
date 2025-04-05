import SettingsService from "@/services/settings";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/pin/[userId]";
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
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED);

    const { pin } = await req.json();
    await SettingsService.updatePin(userId, pin);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
