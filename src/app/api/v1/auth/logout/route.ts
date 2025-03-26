import { deleteAuthCookie } from "@/utils/cookie";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    deleteAuthCookie();

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
