import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { name, email, password, confirmPassword } = await req.json();

    const { token, userId } = await AuthService.register(
      name,
      email,
      password,
      confirmPassword,
    );

    const nextResponse = NextResponse.json({ userId }, { status: 200 });

    return await generateAPIAuthCookie(nextResponse, token);
  } catch (error) {
    return handleError(error);
  }
}
