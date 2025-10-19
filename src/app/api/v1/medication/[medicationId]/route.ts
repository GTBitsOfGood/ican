import { Medication } from "@/db/models/medication";
import { cacheControlMiddleware } from "@/middleware/cache-control";
import MedicationService from "@/services/medication";
import JWTService from "@/services/jwt";
import { verifyMedication } from "@/utils/auth";
import { verifyParentalMode } from "@/utils/parentalControl";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/medication/[medicationId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    const medication: Medication =
      await MedicationService.getMedication(medicationId);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(medication, { status: 200, headers });
  } catch (err) {
    return handleError(err);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> },
) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenUser = await validateRoutes(req, req.method, route, authToken);

    // Check parental control access
    if (authToken) {
      const tokenPayload = JWTService.verifyToken(authToken);
      verifyParentalMode(tokenPayload);
    }

    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);

    const body = await req.json();
    await MedicationService.updateMedication(medicationId, body);

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
    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenUser = await validateRoutes(req, req.method, route, authToken);

    if (authToken) {
      const tokenPayload = JWTService.verifyToken(authToken);
      verifyParentalMode(tokenPayload);
    }

    const medicationId = (await params).medicationId;
    await verifyMedication(tokenUser, medicationId);
    await MedicationService.deleteMedication(medicationId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
