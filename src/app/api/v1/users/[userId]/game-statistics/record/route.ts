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
    verifyUser(tokenUser, userId);
    const { gameName, result } = await req.json();

    await GameStatisticsService.recordGameResult(userId, gameName, result);
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
