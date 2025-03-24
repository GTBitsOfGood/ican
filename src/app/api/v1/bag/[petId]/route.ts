import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { validateBagRequest } from "@/services/bag";
import { BagItem } from "@/db/models/bag";
import { verifyPet } from "@/utils/auth";

const route = "/api/v1/bag/[petId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(req, req.method, route);
    const petId = (await params).petId;
    await verifyPet(tokenUser, petId);

    const items: BagItem[] = await validateBagRequest(petId);

    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
