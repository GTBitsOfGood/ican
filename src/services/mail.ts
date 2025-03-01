import { validateSendEmail } from "@/utils/serviceUtils/mailUtil";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      validateSendEmail({ to, subject, html });
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
      });

      console.log("Email sent:", info.messageId);
      return true;
    } catch {
      throw new Error("Email failed to send.");
    }
  }
}
