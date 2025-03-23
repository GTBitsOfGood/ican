import SettingsService from "@/services/settings";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/settings/pin/[userId]";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);

    const userId = (await params).userId;
    const { pin } = await req.json();
    await SettingsService.updatePin(userId, pin);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
