import AuthService from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/auth/child-login-type";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );

    const { email } = await req.json();
    const result = await AuthService.getChildPasswordType(email);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
