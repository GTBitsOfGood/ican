import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
    );
    const { password, confirmPassword } = await req.json();

    // There is the option of having changePassword take an optional userId, then let the schema check there
    if (!tokenUser) {
      throw new Error(
        "Token was not checked when it was expected, ensure route map defines authorization.",
      );
    }
    await ForgotPasswordService.changePassword(
      tokenUser._id.toString(),
      password,
      confirmPassword,
    );
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
