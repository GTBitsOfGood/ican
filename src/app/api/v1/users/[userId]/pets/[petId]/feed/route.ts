import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { verifyPet } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const PATCH = withAuth<{ userId: string; petId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; petId: string } },
    tokenUser: UserDocument,
  ) => {
    const { petId } = params;
    await verifyPet(tokenUser, petId);

    const updatedPet = await PetService.feedPet(petId);
    return NextResponse.json(updatedPet, { status: 200 });
  },
);
