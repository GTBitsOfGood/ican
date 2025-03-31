import { validatePurchase } from "@/services/store";
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
    const { petId, itemName } = await req.json();

    // Make into class, change function name
    await validatePurchase(petId, itemName);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
