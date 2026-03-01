import PetService from "@/services/pets";
import { NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/utils/auth";
import ERRORS from "@/utils/errorMessages";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";
import { cacheControlMiddleware } from "@/middleware/cache-control";

export const POST = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    const { name, petType } = await req.json();
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    const createdPet = await PetService.createPet(userId, name, petType);
    return NextResponse.json(createdPet, { status: 200 });
  },
);

export const GET = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    const pet = await PetService.getPet(userId);
    const headers = cacheControlMiddleware(req);
    return NextResponse.json(pet, { status: 200, headers });
  },
);

export const PATCH = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    const { name } = await req.json();
    await PetService.updatePet(userId, name);
    return new NextResponse(null, { status: 204 });
  },
);

export const DELETE = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.PET.UNAUTHORIZED);

    await PetService.deletePet(userId);
    return new NextResponse(null, { status: 204 });
  },
);
