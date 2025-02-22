import { InternalServerError } from "@/types/exceptions";
import nodemailer, { Transporter } from "nodemailer";

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Change this so it doesn't have to be called every time
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

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

  async sendPasswordCode(to: string, code: string): Promise<boolean> {
    const subject = "iCAN Account Recovery";

    const html = `<h2> Someone is trying to reset your iCAN account.</h2>
    <p>Your verification code is: ${code}</p>
    <p>If you did not request this, you can ignore this email</p>`;

    return await this.sendEmail(to, subject, html);
  }
}

let emailService: EmailService | null = null;

export function getEmailService() {
  if (!emailService) {
    emailService = new EmailService();
  }
  return emailService;
}
