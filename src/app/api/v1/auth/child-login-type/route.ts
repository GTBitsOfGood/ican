import AuthService from "@/services/auth";
import { withoutAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";

export const POST = withoutAuth<Record<string, never>>(
  async (req: NextRequest) => {
    const { email } = await req.json();
    const result = await AuthService.getChildPasswordType(email);

    return NextResponse.json(result, { status: 200 });
  },
);
