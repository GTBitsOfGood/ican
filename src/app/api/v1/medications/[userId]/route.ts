import MedicationService from "@/services/medication";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cacheControlMiddleware } from "@/middleware/cache-control";

const route = "/api/v1/medications/[userId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const userId = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const medication = await MedicationService.getMedications(userId);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(medication, { status: 200, headers });
  } catch (err) {
    return handleError(err);
  }
}
