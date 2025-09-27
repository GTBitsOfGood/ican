import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
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

    const { name, email } = await req.json();

    const { token, userId, isNewUser } = await AuthService.loginWithGoogle(
      name,
      email,
    );

    const nextResponse = NextResponse.json(
      { userId, isNewUser },
      { status: 200 },
    );

    const response = generateAPIAuthCookie(nextResponse, token);

    return response;
  } catch (error) {
    return handleError(error);
  }
}
