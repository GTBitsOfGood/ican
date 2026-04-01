import UserService from "@/services/user";
import { NextRequest, NextResponse } from "next/server";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import { TUTORIAL_MODES, TUTORIAL_STATES } from "@/types/user";

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

    const {
      tutorialCompleted,
      tutorialState,
      tutorialMode,
      tutorialStep,
      tutorialMedicationType,
      tutorialShouldShowMedicationDrag,
    } = await req.json();

    if (!TUTORIAL_STATES.includes(tutorialState)) {
      return NextResponse.json(
        { error: "tutorialState must be a valid tutorial stage" },
        { status: 400 },
      );
    }

    if (tutorialMode !== null && !TUTORIAL_MODES.includes(tutorialMode)) {
      return NextResponse.json(
        { error: "tutorialMode must be initial, replay, or null" },
        { status: 400 },
      );
    }

    if (
      tutorialCompleted !== undefined &&
      typeof tutorialCompleted !== "boolean"
    ) {
      return NextResponse.json(
        { error: "tutorialCompleted must be a boolean when provided" },
        { status: 400 },
      );
    }

    if (tutorialStep !== undefined) {
      if (
        typeof tutorialStep !== "number" ||
        !Number.isInteger(tutorialStep) ||
        tutorialStep < 0
      ) {
        return NextResponse.json(
          {
            error: "tutorialStep must be a non-negative integer when provided",
          },
          { status: 400 },
        );
      }
    }

    if (
      tutorialMedicationType !== undefined &&
      tutorialMedicationType !== null &&
      tutorialMedicationType !== "Pill" &&
      tutorialMedicationType !== "Syrup" &&
      tutorialMedicationType !== "Shot"
    ) {
      return NextResponse.json(
        { error: "tutorialMedicationType must be Pill, Syrup, Shot, or null" },
        { status: 400 },
      );
    }

    if (
      tutorialShouldShowMedicationDrag !== undefined &&
      typeof tutorialShouldShowMedicationDrag !== "boolean"
    ) {
      return NextResponse.json(
        {
          error:
            "tutorialShouldShowMedicationDrag must be a boolean when provided",
        },
        { status: 400 },
      );
    }

    await UserService.updateTutorialStatus(userId, {
      tutorialCompleted,
      tutorialState,
      tutorialMode,
      tutorialStep,
      tutorialMedicationType,
      tutorialShouldShowMedicationDrag,
    });
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
