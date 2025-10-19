import MedicationService from "@/services/medication";
import JWTService from "@/services/jwt";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { verifyParentalMode } from "@/utils/parentalControl";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authToken = (await cookies()).get("auth_token")?.value;

    await validateRoutes(
      req,
      req.method,
      req.nextUrl.pathname.toString(),
      authToken,
    );

    if (authToken) {
      const tokenPayload = JWTService.verifyToken(authToken);
      verifyParentalMode(tokenPayload);
    }

    const body = await req.json();
    const id: string = await MedicationService.createMedication(body);

    return NextResponse.json(id, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
