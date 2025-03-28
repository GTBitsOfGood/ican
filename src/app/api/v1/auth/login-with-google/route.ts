import AuthService from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { name, email } = await req.json();

    const response = await AuthService.loginWithGoogle(name, email);

    return NextResponse.json({ token: response }, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
