import { deletePet, getPet, updatePet } from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { Pet } from "@/db/models";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";

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
    const pet: Pet | null = await getPet(userId);
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
    await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;
    const { name } = await req.json();

    await updatePet(userId, name);

    return new Response(null, { status: 204 });
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
    await validateRoutes(req, req.method, route);
    const userId: string = (await params).userId;

    await deletePet(userId);

    return new Response(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
