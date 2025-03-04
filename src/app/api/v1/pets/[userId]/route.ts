import { Pet } from "@/db/models";
import PetService from "@/services/pets";
import { UnauthorizedError } from "@/types/exceptions";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { NextRequest, NextResponse } from "next/server";

// Can't use req.nextUrl.pathname to get URL so it has to be hardcoded in each dynamic route if we want to use routeMap
const route = "/api/v1/pets/[userId]";
// Get Pet
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;

    // The service seems to already throw an error in case of a null pet, will check this later
    const pet: Pet | null = await PetService.getPet(userId);
    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// Update Pet
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUserId = await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;
    if (tokenUserId != userId) {
      throw new UnauthorizedError(
        "User is not permitted to modify another user's pet",
      );
    }
    const { name } = await req.json();

    await PetService.updatePet(userId, name);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

// Delete Pet
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUserId = await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;
    if (tokenUserId !== userId) {
      throw new UnauthorizedError(
        "User is not permitted to modify another user's pet",
      );
    }

    await PetService.deletePet(userId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
