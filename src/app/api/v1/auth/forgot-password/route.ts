import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { email } = await req.json();

    const userId = await ForgotPasswordService.sendPasswordCode(email);

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
