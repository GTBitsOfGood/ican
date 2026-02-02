import { Medication } from "@/db/models/medication";
import { cacheControlMiddleware } from "@/middleware/cache-control";
import MedicationService from "@/services/medication";
import JWTService from "@/services/jwt";
import { verifyMedication } from "@/utils/auth";
import { verifyParentalMode } from "@/utils/parentalControl";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import { cookies } from "next/headers";

export const GET = withAuth<{ userId: string; medicationId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; medicationId: string } },
    tokenUser: UserDocument,
  ) => {
    const { medicationId } = params;
    await verifyMedication(tokenUser, medicationId);

    const medication: Medication =
      await MedicationService.getMedication(medicationId);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(medication, { status: 200, headers });
  },
);

export const PATCH = withAuth<{ userId: string; medicationId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; medicationId: string } },
    tokenUser: UserDocument,
  ) => {
    const { medicationId } = params;
    await verifyMedication(tokenUser, medicationId);

    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenPayload = JWTService.verifyToken(authToken!);
    verifyParentalMode(tokenPayload);

    const body = await req.json();
    await MedicationService.updateMedication(medicationId, body);

    return new NextResponse(null, { status: 204 });
  },
);

export const DELETE = withAuth<{ userId: string; medicationId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; medicationId: string } },
    tokenUser: UserDocument,
  ) => {
    const { medicationId } = params;
    await verifyMedication(tokenUser, medicationId);

    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenPayload = JWTService.verifyToken(authToken!);
    verifyParentalMode(tokenPayload);

    await MedicationService.deleteMedication(medicationId);
    return new NextResponse(null, { status: 204 });
  },
);
