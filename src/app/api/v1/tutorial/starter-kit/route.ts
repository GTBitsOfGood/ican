import TutorialService from "@/services/tutorial";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth(
  async (
    _req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    const pet = await TutorialService.ensureStarterCoins(user._id.toString());
    return NextResponse.json(pet, { status: 200 });
  },
);
