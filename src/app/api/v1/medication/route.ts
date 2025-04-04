import MedicationService from "@/services/medication";
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
    const body = await req.json();
    const id: string = await MedicationService.createMedication(body);

    return NextResponse.json(id, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
