import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { userId, code } = await req.json();

    const token: string = await ForgotPasswordService.verifyForgotPasswordCode(
      userId,
      code,
    );

    return NextResponse.json({ token }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
