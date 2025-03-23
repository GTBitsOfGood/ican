import SettingsService from "@/services/settings";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/[userId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const userId = (await params).userId;

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
    await validateRoutes(req, req.method, route);
    const userId = (await params).userId;

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
