import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { NextRequest, NextResponse } from "next/server";
import { LoginType } from "@/types/user";
import { withoutAuth } from "@/utils/withAuth";

export const POST = withoutAuth<Record<string, never>>(
  async (req: NextRequest) => {
    const { email, password, loginType, rememberMe } = await req.json();

    const { token, userId } = await AuthService.login(
      email,
      password,
      loginType ?? LoginType.PARENT,
    );

    const nextResponse = NextResponse.json({ userId }, { status: 200 });

    return await generateAPIAuthCookie(
      nextResponse,
      token,
      rememberMe ?? false,
    );
  },
);
