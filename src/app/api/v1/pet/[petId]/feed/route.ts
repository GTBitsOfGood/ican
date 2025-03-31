import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";

const route = "/api/v1/pet/[petId]/feed";
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );

    await PetService.feedPet((await params).petId);

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
