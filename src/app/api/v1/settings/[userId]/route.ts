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
  const MAX_RETRIES = 3;
  let lastError: unknown;

  // Retry loop to handle optimistic locking conflicts
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
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

      const { tokenReissue, updatedSettings } =
        await SettingsService.updateSettings(userId, {
          helpfulTips,
          largeFontSize,
          notifications,
          parentalControl,
        });

      const response = new NextResponse(null, { status: 204 });

      if (tokenReissue) {
        // Use the atomically updated settings instead of fetching again
        const newToken = JWTService.generateToken(
          {
            userId,
            parentalControls: updatedSettings.parentalControl,
            parentalModeExpiresAt: 0,
            origin: "login",
          },
          7776000000,
        );

        await generateAPIAuthCookie(response, newToken);
      }

      return response;
    } catch (err) {
      // Check if it's a conflict error (optimistic locking failure)
      if (
        err instanceof Error &&
        err.message.includes("Settings were modified by another request")
      ) {
        lastError = err;
        // Wait a bit before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, attempt) * 50),
        );
        continue; // Retry
      }
      // For other errors, fail immediately
      return handleError(err);
    }
  }

  // All retries exhausted
  return handleError(lastError);
}
