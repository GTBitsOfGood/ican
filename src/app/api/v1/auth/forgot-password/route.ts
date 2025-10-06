import ForgotPasswordService from "@/services/forgotPasswordCodes";
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
    const { email, userId } = await req.json();

    const validatedUserId = await ForgotPasswordService.sendPasswordCode(
      email,
      userId,
    );

    return NextResponse.json({ validatedUserId }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
