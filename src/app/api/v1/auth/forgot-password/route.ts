import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { withoutAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withoutAuth(async (req: NextRequest) => {
  const { email, userId } = await req.json();

  const validatedUserId = await ForgotPasswordService.sendPasswordCode(
    email,
    userId,
  );

  return NextResponse.json({ userId: validatedUserId }, { status: 200 });
});
