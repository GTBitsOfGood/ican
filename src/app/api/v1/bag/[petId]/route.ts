import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import BagService from "@/services/bag";
import { verifyPet } from "@/utils/auth";
import { cookies } from "next/headers";
import { cacheControlMiddleware } from "@/middleware/cache-control";

const route = "/api/v1/bag/[petId]";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ petId: string }> },
) {
  try {
    const tokenUser = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );
    const petId = (await params).petId;
    await verifyPet(tokenUser, petId);

    const items = await BagService.validateBagRequest(petId);

    const headers = cacheControlMiddleware(req);
    return NextResponse.json(items, { status: 200, headers });
  } catch (error) {
    return handleError(error);
  }
}
