import TutorialService from "@/services/tutorial";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const GET = withAuth(
  async (
    _req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    const progress = await TutorialService.getTutorialProgress(
      user._id.toString(),
    );
    return NextResponse.json(progress, { status: 200 });
  },
);
