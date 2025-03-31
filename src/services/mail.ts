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
        baseURL:
          "***REMOVED***",
      });
      const response = await juno.email.sendEmail({
        subject,
        recipients: [
          {
            email: to,
            name: "Email",
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

        sender: {
          email: "hello@bitsofgood.org",
          name: "Bits of Good",
        },
      });

      console.log("Email Status:", response.success);
      return true;
    } catch (error) {
      console.log(error);
      throw new Error(ERRORS.MAIL.FAILURE);
    }
  }
}
