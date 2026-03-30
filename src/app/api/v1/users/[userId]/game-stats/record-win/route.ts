import GameStatsService from "@/services/gameStats";
import { NextRequest, NextResponse } from "next/server";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    const body = await req.json();
    const { gameType, coinsEarned } = body;

    if (!gameType || typeof coinsEarned !== "number" || coinsEarned < 0) {
      return NextResponse.json(
        { error: "Invalid input for gameType or coinsEarned" },
        { status: 400 },
      );
    }

    const stats = await GameStatsService.recordGameWin(
      userId,
      gameType,
      coinsEarned,
    );
    return NextResponse.json(stats, { status: 200 });
  },
);
