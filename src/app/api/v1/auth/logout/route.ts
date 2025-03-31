import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    (await cookies()).delete("auth_token");

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
