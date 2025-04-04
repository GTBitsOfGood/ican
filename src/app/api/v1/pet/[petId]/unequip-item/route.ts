import { validateUnequip } from "@/services/pets";
import { verifyPet } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Not implemented as of now
const route = "/api/v1/pet/[petId]/unequip-item";
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

    const attribute = await req.json();

    await validateUnequip(petId, attribute);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
