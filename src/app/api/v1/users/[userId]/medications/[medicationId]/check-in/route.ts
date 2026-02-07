import { NextRequest, NextResponse } from "next/server";
import MedicationService from "@/services/medication";
import { verifyMedication } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth<{ userId: string; medicationId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; medicationId: string } },
    tokenUser: UserDocument,
  ) => {
    const { medicationId } = params;
    await verifyMedication(tokenUser, medicationId);

    const { localTime } = await req.json();
    await MedicationService.createMedicationCheckIn(medicationId, localTime);

    return NextResponse.json({}, { status: 201 });
  },
);
