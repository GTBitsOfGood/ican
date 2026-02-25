import { createTokenRequest } from "@/lib/ably";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth(
  async (
    _req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    const tokenRequest = await createTokenRequest(user._id.toString());
    return NextResponse.json(tokenRequest);
  },
);
