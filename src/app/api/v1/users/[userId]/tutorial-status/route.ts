import UserService from "@/services/user";
import { NextRequest, NextResponse } from "next/server";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import { INITIAL_TUTORIAL_STAGES } from "@/types/user";

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    const tutorialStatus = await UserService.getTutorialStatus(userId);
    return NextResponse.json(tutorialStatus, { status: 200 });
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

    const { initialTutorialStage } = await req.json();

    if (!INITIAL_TUTORIAL_STAGES.includes(initialTutorialStage)) {
      return NextResponse.json(
        { error: "initialTutorialStage must be a valid tutorial stage" },
        { status: 400 },
      );
    }

    await UserService.updateTutorialStatus(userId, {
      initialTutorialStage,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
