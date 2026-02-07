import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { verifyPet } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth<{ userId: string; petId: string; name: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; petId: string; name: string } },
    tokenUser: UserDocument,
  ) => {
    const { petId, name } = params;
    await verifyPet(tokenUser, petId);

    const appearance = await req.json();
    await PetService.saveOutfit(petId, name, appearance);
    return new NextResponse(null, { status: 204 });
  },
);

export const DELETE = withAuth<{
  userId: string;
  petId: string;
  name: string;
}>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string; petId: string; name: string } },
    tokenUser: UserDocument,
  ) => {
    const { petId, name } = params;
    await verifyPet(tokenUser, petId);

    await PetService.deleteOutfit(petId, name);
    return new NextResponse(null, { status: 204 });
  },
);
