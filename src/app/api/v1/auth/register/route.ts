import { validateCreateUser } from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { name, email, password, confirmPassword } = await req.json();

    const response: { token: string } = await validateCreateUser(
      name,
      email,
      password,
      confirmPassword,
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
