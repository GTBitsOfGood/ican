import AuthService from "@/services/auth";
import { generateAuthCookie } from "@/utils/cookie";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());
    const { name, email, password, confirmPassword } = await req.json();

    const authToken = await AuthService.register(
      name,
      email,
      password,
      confirmPassword,
    );

    const nextResponse = NextResponse.json({}, { status: 201 });

    const response = generateAuthCookie(nextResponse, authToken);

    return response;
  } catch (error) {
    return handleError(error);
  }
}
