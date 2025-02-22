import { changePassword } from "@/services/forgotPasswordCodes";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { password, confirmPassword } = await req.json();

    const token = "placeholder";
    await changePassword(token, password, confirmPassword);

    return NextResponse.json(
      { message: "Password updated sucessfully!" },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error);
  }
}
