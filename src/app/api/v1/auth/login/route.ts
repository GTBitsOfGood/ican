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
    const { email, password } = await req.json();

    const { token, userId } = await AuthService.login(email, password);

    const nextResponse = NextResponse.json({ userId }, { status: 200 });

    const response = generateAPIAuthCookie(nextResponse, token);

    return response;
  } catch (error) {
    return handleError(error);
  }
}
