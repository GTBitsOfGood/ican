import UserService from "@/services/user";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";

const route = "/api/v1/user/[userId]/onboarding-status";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenUser = await validateRoutes(req, req.method, route, authToken);

    const userId: string = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    const isOnboarded = await UserService.getOnboardingStatus(userId);

    return NextResponse.json({ isOnboarded }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenUser = await validateRoutes(req, req.method, route, authToken);

    const userId: string = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    const { isOnboarded } = await req.json();

    if (typeof isOnboarded !== "boolean") {
      return NextResponse.json(
        { error: "isOnboarded must be a boolean" },
        { status: 400 },
      );
    }

    await UserService.updateOnboardingStatus(userId, isOnboarded);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
