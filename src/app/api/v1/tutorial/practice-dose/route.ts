import TutorialService from "@/services/tutorial";
import { handleError } from "@/utils/errorHandler";
import { validateRoutes } from "@/utils/validateRoute";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const route = "/api/v1/tutorial/practice-dose";

export async function POST(req: NextRequest) {
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

    const pet = await TutorialService.grantPracticeDoseReward(
      user._id.toString(),
    );
    return NextResponse.json(pet, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}
