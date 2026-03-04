import GameStatisticsService from "@/services/gameStatistics";
import { NextRequest, NextResponse } from "next/server";
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
    verifyUser(tokenUser, userId);

    const stats = await GameStatisticsService.getGameStatistics(userId);
    return NextResponse.json(stats, { status: 200 });
  },
);
