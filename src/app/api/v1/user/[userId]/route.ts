import UserService from "@/services/user";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/user/[userId]";
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;

    await UserService.deleteUser(userId);
    (await cookies()).delete("auth_token");
    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
