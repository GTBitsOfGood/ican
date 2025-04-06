import PetService from "@/services/pets";
import { verifyPet } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/pet/[petId]/equip-item";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const petId = (await params).petId;
    await verifyPet(tokenUser, petId);

    const { name, type } = await req.json();

    await PetService.validateEquipItem(petId, name, type);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
