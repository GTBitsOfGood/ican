import AuthService from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    const authorization = req.headers.get("authorization");
    const token = authorization!.split(" ")[1];
    const decodedToken = await AuthService.validateToken(token);
    return NextResponse.json(
      { isValid: true, decodedToken: decodedToken },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error);
  }
}
