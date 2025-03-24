import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import MedicationService from "@/services/medication";

const route = "/api/v1/medication/[medicationId]/log";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const { pin } = await req.json();

    const medicationId = (await params).medicationId;

    await MedicationService.createMedicationLog(medicationId, pin);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
