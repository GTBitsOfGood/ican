import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const PATCH = withAuth<Record<string, never>>(
  async (req: NextRequest, _context, tokenUser: UserDocument) => {
    const { password, confirmPassword } = await req.json();

    await ForgotPasswordService.changePassword(
      tokenUser._id.toString(),
      password,
      confirmPassword,
    );

    (await cookies()).delete("auth_token");
    return new NextResponse(null, { status: 204 });
  },
);
