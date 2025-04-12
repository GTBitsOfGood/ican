import { cacheControlMiddleware } from "@/middleware/cache-control";
import MedicationService from "@/services/medication";
import { MedicationSchedule } from "@/types/medication";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medications/[userId]/schedule";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { searchParams } = new URL(req.url);
  const userId = (await params).userId;
  const date = searchParams.get("date") as string;
  const localTime = searchParams.get("localTime") as string;

  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const schedule: MedicationSchedule =
      await MedicationService.getMedicationsSchedule(userId, date, localTime);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(schedule, { status: 200, headers });
  } catch (err) {
    return handleError(err);
  }
}
