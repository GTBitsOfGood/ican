import StoreService from "@/services/store";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      (await cookies()).get("auth_token")?.value,
    );
    const { petId, name, type } = await req.json();

    await StoreService.validatePurchase(petId, name, type);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
