import MedicationService from "@/services/medication";
import { MedicationSchedule } from "@/types/medication";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medications/schedule";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") as string;
  const date = searchParams.get("date") as string;

  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const schedule: MedicationSchedule =
      await MedicationService.getMedicationsSchedule(userId, date);

    return NextResponse.json(schedule, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
