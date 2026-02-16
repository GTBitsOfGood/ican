import UserService from "@/services/user";
import { NextRequest, NextResponse } from "next/server";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    const isOnboarded = await UserService.getOnboardingStatus(userId);
    return NextResponse.json({ isOnboarded }, { status: 200 });
  },
);

export const PUT = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
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
  },
);
