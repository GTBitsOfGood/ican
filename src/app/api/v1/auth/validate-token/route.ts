import AuthService from "@/services/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { handleError } from "@/utils/errorHandler";

export async function POST() {
  try {
    const token = (await cookies()).get("auth_token")?.value as string;

    const decodedToken = await AuthService.validateToken(token);

    return NextResponse.json(
      { isValid: true, decodedToken: decodedToken },
      { status: 200 },
    );
  } catch (error) {
    handleError(error);
  }
}
