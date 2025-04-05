import PetService from "@/services/pets";
import { verifyPet } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/pet/[petId]/equip-outfit";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const petId = (await params).petId;
    await verifyPet(tokenUser, petId);

    const appearance = await req.json();

    await PetService.validateEquipOutfit(petId, appearance);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
