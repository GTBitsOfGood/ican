import AuthService from "@/services/auth";
import { verifyUser } from "@/utils/auth";
import { generateAPIAuthCookie } from "@/utils/cookie";
import ERRORS from "@/utils/errorMessages";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const DELETE = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.SETTINGS.UNAUTHORIZED.USER_ID);

    const newToken = await AuthService.disableParentalMode(userId);

    const nextResponse = new NextResponse(null, { status: 204 });
    const response = generateAPIAuthCookie(nextResponse, newToken);

    return response;
  },
);
