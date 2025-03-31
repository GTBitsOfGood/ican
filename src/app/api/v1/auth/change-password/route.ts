import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { password, confirmPassword } = await req.json();

    // There is the option of having changePassword take an optional userId, then let the schema check there
    if (!userId) {
      throw new Error(
        "Token was not checked when it was expected, ensure route map defines authorization.",
      );
    }
    await ForgotPasswordService.changePassword(
      userId,
      password,
      confirmPassword,
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
