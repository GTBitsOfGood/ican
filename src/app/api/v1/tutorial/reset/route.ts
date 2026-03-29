import TutorialService from "@/services/tutorial";
import { withAuth } from "@/utils/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { UserDocument } from "@/db/models/user";

export const POST = withAuth(
  async (
    req: NextRequest,
    _context: { params: unknown },
    user: UserDocument,
  ) => {
    const body = await req.json().catch(() => ({}));
    const restorePetState =
      body?.restorePetState &&
      typeof body.restorePetState === "object" &&
      typeof body.restorePetState.coins === "number" &&
      typeof body.restorePetState.xpGained === "number" &&
      typeof body.restorePetState.xpLevel === "number" &&
      typeof body.restorePetState.food === "number"
        ? {
            coins: body.restorePetState.coins,
            xpGained: body.restorePetState.xpGained,
            xpLevel: body.restorePetState.xpLevel,
            food: body.restorePetState.food,
            lastFedAt:
              typeof body.restorePetState.lastFedAt === "string"
                ? new Date(body.restorePetState.lastFedAt)
                : null,
          }
        : null;
    const setCoins = typeof body?.setCoins === "number" ? body.setCoins : null;

    await TutorialService.resetTutorialArtifacts(user._id.toString());
    if (restorePetState !== null) {
      await TutorialService.restoreReplayPetState(
        user._id.toString(),
        restorePetState,
      );
    }
    if (setCoins !== null) {
      await TutorialService.restoreReplayCoins(user._id.toString(), setCoins);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  },
);
