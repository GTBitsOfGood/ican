import TutorialService from "@/services/tutorial";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const PUT = withAuth(
  async (
    _req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    const medicationId = await TutorialService.setupTutorialMedication(
      user._id.toString(),
    );
    return NextResponse.json({ medicationId }, { status: 200 });
  },
);
