import { validateSendEmail } from "@/utils/serviceUtils/mailUtil";
import ERRORS from "@/utils/errorMessages";
import juno from "juno-sdk";

export default class EmailService {
  static async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<boolean> {
    try {
      validateSendEmail({ to, subject, html });

      juno.init({
        apiKey: process.env.JUNO_API_KEY as string,
      });

      const response = await juno.email.sendEmail({
        subject,
        recipients: [
          {
            email: to,
          },
        ],
        contents: [
          {
            value: html,
            type: "text/html",
          },
        ],
        bcc: [],
        cc: [],
        sender: { email: process.env.MAIL_USER as string, name: "iCAN" },
      });

      console.log("Email Status:", response.success);
      return true;
    } catch {
      throw new Error(ERRORS.MAIL.FAILURE);
    }
  }
}
