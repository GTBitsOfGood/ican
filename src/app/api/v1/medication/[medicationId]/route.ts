import { Medication } from "@/db/models/medication";
import MedicationService from "@/services/medication";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medication/[medicationId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    const medication: Medication =
      await MedicationService.getMedication(medicationId);

    return NextResponse.json(medication, { status: 201 });
  } catch (err) {
    handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    const body = await req.json();
    await MedicationService.updateMedication(medicationId, body);
    await validateRoutes(req, req.method, route);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const medicationId = (await params).medicationId;
    await MedicationService.deleteMedication(medicationId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    handleError(err);
  }
}
