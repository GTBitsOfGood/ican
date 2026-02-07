import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { NextRequest, NextResponse } from "next/server";
import { withoutAuth } from "@/utils/withAuth";

export const POST = withoutAuth<Record<string, never>>(
  async (req: NextRequest) => {
    const { name, email } = await req.json();

    const { token, userId, isNewUser } = await AuthService.loginWithGoogle(
      name,
      email,
    );

    const nextResponse = NextResponse.json(
      { userId, isNewUser },
      { status: 200 },
    );

    return await generateAPIAuthCookie(nextResponse, token);
  },
);
