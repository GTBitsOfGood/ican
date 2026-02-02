import AuthService from "@/services/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { NextRequest, NextResponse } from "next/server";
import { withoutAuth } from "@/utils/withAuth";

export const POST = withoutAuth<Record<string, never>>(
  async (req: NextRequest) => {
    const { name, email, password, confirmPassword } = await req.json();

    const { token, userId } = await AuthService.register(
      name,
      email,
      password,
      confirmPassword,
    );

    const nextResponse = NextResponse.json({ userId }, { status: 200 });

    return await generateAPIAuthCookie(nextResponse, token);
  },
);
