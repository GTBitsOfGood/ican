import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { NextRequest, NextResponse } from "next/server";
import { withoutAuth } from "@/utils/withAuth";

export const POST = withoutAuth<Record<string, never>>(
  async (req: NextRequest) => {
    const { email, password, rememberMe } = await req.json();

    const { token, userId } = await AuthService.login(email, password);

    const nextResponse = NextResponse.json({ userId }, { status: 200 });

    return await generateAPIAuthCookie(
      nextResponse,
      token,
      rememberMe ?? false,
    );
  },
);
