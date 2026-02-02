import MedicationService from "@/services/medication";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import { cacheControlMiddleware } from "@/middleware/cache-control";
import JWTService from "@/services/jwt";
import { verifyParentalMode } from "@/utils/parentalControl";
import { cookies } from "next/headers";

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const medication = await MedicationService.getMedications(userId);
    const headers = cacheControlMiddleware(req);
    return NextResponse.json(medication, { status: 200, headers });
  },
);

export const POST = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.MEDICATION.UNAUTHORIZED);

    const authToken = (await cookies()).get("auth_token")?.value;
    const tokenPayload = JWTService.verifyToken(authToken!);
    verifyParentalMode(tokenPayload);

    const body = await req.json();
    const medicationData = { ...body, userId };
    const id: string = await MedicationService.createMedication(medicationData);

    return NextResponse.json(id, { status: 201 });
  },
);
