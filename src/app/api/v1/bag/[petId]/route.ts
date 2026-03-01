import { NextRequest, NextResponse } from "next/server";
import BagService from "@/services/bag";
import { verifyPet } from "@/utils/auth";
import { cacheControlMiddleware } from "@/middleware/cache-control";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth<{ petId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { petId: string } },
    tokenUser: UserDocument,
  ) => {
    const { petId } = params;
    await verifyPet(tokenUser, petId);

    const items = await BagService.validateBagRequest(petId);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(items, { status: 200, headers });
  },
);
