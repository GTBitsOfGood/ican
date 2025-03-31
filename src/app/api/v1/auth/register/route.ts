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

    const authToken = await AuthService.register(
      name,
      email,
      password,
      confirmPassword,
    );

    const nextResponse = NextResponse.json({}, { status: 201 });

    const response = generateAPIAuthCookie(nextResponse, authToken);

    return response;
  } catch (error) {
    return handleError(error);
  }
}
