import { validateLogin } from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

// All of these can technically be condensed down to on

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const { email, password } = await req.json();

    const response = await validateLogin(email, password);

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
