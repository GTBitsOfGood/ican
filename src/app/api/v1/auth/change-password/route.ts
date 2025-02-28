import { changePassword } from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
    );
    const { password, confirmPassword } = await req.json();

    if (!userId) {
      // Not sure what error to throw here, it would only realistically happen when route maps authorization doesn't match up
      throw new Error(
        "Token was not checked when it was expected, ensure route map defines authorization.",
      );
    }
    await changePassword(userId, password, confirmPassword);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
