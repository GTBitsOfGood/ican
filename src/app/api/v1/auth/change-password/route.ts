import { changePassword } from "@/services/forgotPasswordCodes";
import { UnauthorizedError } from "@/types/exceptions";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { password, confirmPassword } = await req.json();

    // Should we make a function for this?
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      throw new UnauthorizedError("Forbidden");
    }
    const token = authHeader.split(" ")[1];

    await changePassword(token, password, confirmPassword);

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
