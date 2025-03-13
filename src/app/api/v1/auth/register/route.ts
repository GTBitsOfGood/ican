import AuthService from "@/services/auth";
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

    // set expiration date 3 hours after
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 3);

    nextResponse.cookies.set("auth_token", authToken, {
      httpOnly: true,
      expires: expirationDate,
    });

    return nextResponse;
  } catch (error) {
    return handleError(error);
  }
}
