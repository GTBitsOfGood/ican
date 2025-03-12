import AuthService from "@/services/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());
    const userId: string = (await params).userId;

    await AuthService.deleteUser(userId);

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
