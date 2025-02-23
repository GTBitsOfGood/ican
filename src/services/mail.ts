import { InternalServerError } from "@/types/exceptions";
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
      const info = await transporter.sendMail({
        from: process.env.MAIL_USER,
        to,
        subject,
        html,
      });

      console.log("Email sent:", info.messageId);
      return true;
    } catch {
      throw new InternalServerError("Email Failed to send.");
    }
  }

  static async sendPasswordCode(to: string, code: string): Promise<boolean> {
    const subject = "iCAN Account Recovery";

    const html = `<h2> Someone is trying to reset your iCAN account.</h2>
    <p>Your verification code is: ${code}</p>
    <p>If you did not request this, you can ignore this email</p>`;

    return await this.sendEmail(to, subject, html);
  }
}
