import AuthService from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { email, password } = await req.json();

    const authToken = await AuthService.login(email, password);

    const nextResponse = NextResponse.json({}, { status: 204 });

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
