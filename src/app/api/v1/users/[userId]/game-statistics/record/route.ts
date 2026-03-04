import GameStatisticsService from "@/services/gameStatistics";
import { NextRequest, NextResponse } from "next/server";
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
    const { gameName, result } = await req.json();
    verifyUser(tokenUser, userId);

    await GameStatisticsService.recordGameResult(userId, gameName, result);
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
