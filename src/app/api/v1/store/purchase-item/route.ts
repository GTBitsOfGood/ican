import StoreService from "@/services/store";
import { UserDocument } from "@/db/models/user";
import { verifyPet } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuth<Record<string, never>>(
  async (req: NextRequest, _context, tokenUser: UserDocument) => {
    const { petId, name, type } = await req.json();

    await verifyPet(tokenUser, petId);
    await StoreService.validatePurchase(petId, name, type);

    return new NextResponse(null, { status: 204 });
  },
);
