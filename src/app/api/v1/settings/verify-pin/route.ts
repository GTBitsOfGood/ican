import SettingsService from "@/services/settings";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { userId, pin } = await req.json();

    const isValid: boolean = await SettingsService.verifyPin(userId, pin);

    return NextResponse.json({ isValid }, { status: 200 });
  } catch (error) {
    console.log(error);

    return handleError(error);
  }
}
