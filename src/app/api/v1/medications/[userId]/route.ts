import MedicationService from "@/services/medication";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medications/[userId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const userId = (await params).userId;
    const medication = await MedicationService.getMedications(userId);

    return NextResponse.json(medication, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
