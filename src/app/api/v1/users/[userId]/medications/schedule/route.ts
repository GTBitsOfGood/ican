import { cacheControlMiddleware } from "@/middleware/cache-control";
import MedicationService from "@/services/medication";
import { MedicationSchedule } from "@/types/medication";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date") as string;
    const localTime = searchParams.get("localTime") as string;

    const schedule: MedicationSchedule =
      await MedicationService.getMedicationsSchedule(userId, date, localTime);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(schedule, { status: 200, headers });
  },
);
