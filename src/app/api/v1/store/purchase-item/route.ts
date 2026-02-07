import StoreService from "@/services/store";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withAuth(async (req: NextRequest) => {
  const { petId, name, type } = await req.json();

  await StoreService.validatePurchase(petId, name, type);

  return new NextResponse(null, { status: 204 });
});
