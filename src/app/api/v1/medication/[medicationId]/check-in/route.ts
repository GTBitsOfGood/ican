import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import MedicationService from "@/services/medication";
import { verifyMedication } from "@/utils/auth";

const route = "/api/v1/medication/[medicationId]/check-in";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    await MedicationService.createMedicationCheckIn(medicationId);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
