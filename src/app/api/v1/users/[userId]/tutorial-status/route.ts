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

    const tutorial_completed = await UserService.getTutorialStatus(userId);
    return NextResponse.json({ tutorial_completed }, { status: 200 });
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

    const { tutorial_completed } = await req.json();

    if (typeof tutorial_completed !== "boolean") {
      return NextResponse.json(
        { error: "tutorial_completed must be a boolean" },
        { status: 400 },
      );
    }

    await UserService.updateTutorialStatus(userId, tutorial_completed);
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
