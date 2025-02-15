import juno from "juno-sdk";
import type {
  EmailRecipient,
  EmailSender,
  EmailContent,
  SendEmailResponse,
  RegisterEmailResponse,
  RegisterDomainResponse,
} from "juno-sdk/internal/api";

juno.init({
  apiKey: process.env.JUNO_API_KEY || "",
  baseURL: process.env.JUNO_API_BASE_URL || "",
});

console.log("Juno Email API:", juno.email);

// I honestly do not know how the juno-sdk works, the read-me for it is just blank. I'm not sure if I'm calling the right functions
// or if I supposed to run a fetch?
export class MailService {
  private defaultSender: EmailSender;

  constructor(defaultSender: EmailSender) {
    this.defaultSender = defaultSender;
  }

  // Theres also registerSenderAddress, registerDomain, verifyDomain in juno-sdk, should I add those?

  async sendEmail(params: {
    recipient: string;
    recipientName?: string;
    subject: string;
    body: string;
    contentType?: "text/plain" | "text/html";
  }): Promise<SendEmailResponse> {
    const {
      recipient,
      recipientName,
      subject,
      body,
      contentType = "text/plain",
    } = params;

    const recipients: EmailRecipient[] = [
      { email: recipient, name: recipientName || recipient },
    ];

    const contents: EmailContent[] = [{ type: contentType, value: body }];

    return juno.email.sendEmail({
      recipients,
      cc: [],
      bcc: [],
      sender: this.defaultSender,
      subject,
      contents,
    });
  }

  async registerSenderAddress(options: {
    email: string;
    name: string;
    replyTo?: string;
  }): Promise<RegisterEmailResponse> {
    return juno.email.registerSenderAddress({
      email: options.email,
      name: options.name,
      replyTo: options.replyTo,
    });
  }

  async registerDomain(
    domain: string,
    subdomain?: string,
  ): Promise<RegisterDomainResponse> {
    return juno.email.registerDomain({ domain, subdomain });
  }

  async verifyDomain(domain: string): Promise<RegisterDomainResponse> {
    return juno.email.verifyDomain({ domain });
  }
}
