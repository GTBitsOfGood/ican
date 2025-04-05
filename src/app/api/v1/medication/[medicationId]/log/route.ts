import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import MedicationService from "@/services/medication";
import { cookies } from "next/headers";
import { verifyMedication } from "@/utils/auth";

const route = "/api/v1/medication/[medicationId]/log";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ customMedicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const customMedicationId = (await params).customMedicationId;
    await verifyMedication(tokenUser, customMedicationId);

    const { pin } = await req.json();

    await MedicationService.createMedicationLog(customMedicationId, pin);

    return NextResponse.json({}, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}
