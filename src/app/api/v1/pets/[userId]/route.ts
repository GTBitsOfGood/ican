import { cacheControlMiddleware } from "@/middleware/cache-control";
import PetService from "@/services/pets";
import { verifyUser } from "@/utils/auth";
import { handleError } from "@/utils/errorHandler";
import ERRORS from "@/utils/errorMessages";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/pets/[userId]";
// Get Pet
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );

    const userId: string = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED); // Unsure if needed for get route

    const pet = await PetService.getPet(userId);
    const headers = cacheControlMiddleware(req);

    return NextResponse.json(pet, { status: 200, headers });
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
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const userId: string = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

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
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const userId: string = (await params).userId;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    await PetService.deletePet(userId);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleError(error);
  }
}
