import TutorialService from "@/services/tutorial";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/tutorial/progress";

export async function GET(req: NextRequest) {
  try {
    const user = await validateRoutes(
      req,
      req.method,
      route,
      (await cookies()).get("auth_token")?.value,
    );

    if (!user) {
      throw new Error("User not authenticated");
    }

    const progress = await TutorialService.getTutorialProgress(
      user._id.toString(),
    );
    return NextResponse.json(progress, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
