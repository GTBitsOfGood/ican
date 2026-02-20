import NotificationService from "@/services/notification";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const emailCount = await NotificationService.checkAndSendEmailFallbacks();
  return NextResponse.json({ emailsSent: emailCount });
}
