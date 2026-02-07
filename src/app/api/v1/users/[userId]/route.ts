import UserService from "@/services/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import ERRORS from "@/utils/errorMessages";
import { verifyUser } from "@/utils/auth";
import { withAuth } from "@/utils/withAuth";
import { UserDocument } from "@/db/models/user";

export const DELETE = withAuth<{ userId: string }>(
  async (
    req: NextRequest,
    { params }: { params: { userId: string } },
    tokenUser: UserDocument,
  ) => {
    const { userId } = params;
    verifyUser(tokenUser, userId, ERRORS.USER.NOT_FOUND);

    await UserService.deleteUser(userId);
    (await cookies()).delete("auth_token");
    return new NextResponse(null, { status: 204 });
  },
);
