import PetService from "@/services/pets";
import { verifyPet } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/pet/[petId]/outfit/[name]";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string; name: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const resolvedParams = await params;
    const petId = resolvedParams.petId;
    const name = resolvedParams.name;
    await verifyPet(tokenUser, petId);

    const appearance = await req.json();

    await PetService.saveOutfit(petId, name, appearance);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string; name: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const resolvedParams = await params;
    const petId = resolvedParams.petId;
    const name = resolvedParams.name;
    await verifyPet(tokenUser, petId);
    await PetService.deleteOutfit(petId, name);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
