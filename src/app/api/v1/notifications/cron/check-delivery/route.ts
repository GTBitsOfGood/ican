import NotificationService from "@/services/notification";
import EmailService from "@/services/mail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const cronSecret = req.headers.get("x-cron-secret");
  if (cronSecret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const emailCount = await NotificationService.checkAndSendEmailFallbacks(
    EmailService.sendEmail.bind(EmailService),
  );
  return NextResponse.json({ emailsSent: emailCount });
}
