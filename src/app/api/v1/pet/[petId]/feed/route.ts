import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";

// Why is it that creating a pet specifically doesn't use UserId in the URL?
// Create Pet
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    await validateRoutes(req, req.method, req.nextUrl.pathname.toString());

    await PetService.feedPet((await params).petId);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return handleError(error);
  }
}

// Also NextJS default convention for 405 Method Not Allowed does not return a body, thats what it currently does
