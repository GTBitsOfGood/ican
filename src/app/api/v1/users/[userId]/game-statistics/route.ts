import GameStatisticsService from "@/services/gameStatistics";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import ERRORS from "@/utils/errorMessages";

export const GET = withAuth<{ userId: string }>(
  async (
    _req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.GAME_STATISTICS.UNAUTHORIZED);

    const data = await GameStatisticsService.getGameStatistics(userId);
    return NextResponse.json(data, { status: 200 });
  },
);
