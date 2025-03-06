import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import MedicationService from "@/services/medication";

const route = "/api/v1/medication/[medicationId]/check-in";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);

    const medicationId = (await params).medicationId;
    await MedicationService.createMedicationCheckIn(medicationId);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
