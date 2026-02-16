import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { generateAPIAuthCookie } from "@/utils/cookie";
import { withoutAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withoutAuth(async (req: NextRequest) => {
  const { userId, code, pin } = await req.json();

  const token: string = await ForgotPasswordService.verifyForgotPasswordCode(
    userId,
    code,
    pin,
  );

  const nextResponse = NextResponse.json({ userId }, { status: 200 });

  return await generateAPIAuthCookie(nextResponse, token);
});
