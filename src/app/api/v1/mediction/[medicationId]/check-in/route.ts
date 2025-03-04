import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import MedicationService from "@/services/medication";

// Why is it that creating a pet specifically doesn't use UserId in the URL?
// Create Pet
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    await MedicationService.createMedicationCheckIn(
      (await params).medicationId,
    );

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
