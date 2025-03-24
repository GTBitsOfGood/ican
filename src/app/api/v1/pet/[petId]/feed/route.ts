import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { verifyPet } from "@/utils/auth";

const route = "/api/v1/pet/[petId]/feed";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const petId = (await params).petId;
    await verifyPet(tokenUser, petId);

    await PetService.feedPet(petId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
