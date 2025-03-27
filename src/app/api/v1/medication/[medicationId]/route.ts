import { Medication } from "@/db/models/medication";
import MedicationService from "@/services/medication";
import { verifyMedication } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medication/[medicationId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    const medication: Medication =
      await MedicationService.getMedication(medicationId);

    return NextResponse.json(medication, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    const body = await req.json();
    await MedicationService.updateMedication(medicationId, body);
    await validateRoutes(req, req.method, route);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    await MedicationService.deleteMedication(medicationId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
