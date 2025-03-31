import AuthService from "@/services/auth";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const token = (await cookies()).get("auth_token")?.value as string;

    const decodedToken = await AuthService.validateToken(token);

    return NextResponse.json(
      { isValid: true, decodedToken: decodedToken },
      { status: 200 },
    );
  } catch (error) {
    // need to return 200 to ensure error messages aren't thrown on frontend
    // in case doesn't exist, want to redirect to /login page
    console.log(error);
    return NextResponse.json(
      { isValid: false, decodedToken: undefined },
      { status: 200 },
    );
  }
}
