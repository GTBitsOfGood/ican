import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";

// Create Pet
export async function POST(req: NextRequest) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { userId, name, petType } = await req.json();
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    const createdPet = await PetService.createPet(userId, name, petType);

    return NextResponse.json(createdPet, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

// Also NextJS default convention for 405 Method Not Allowed does not return a body, thats what it currently does
