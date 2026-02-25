import NotificationService from "../../src/services/notification";
import EmailService from "../../src/services/mail";

const handler = async () => {
  const emailCount = await NotificationService.checkAndSendEmailFallbacks(
    EmailService.sendEmail.bind(EmailService),
  );
  return new Response(JSON.stringify({ emailsSent: emailCount }), {
    status: 200,
  });
};

export default handler;

export const config = {
  schedule: "* * * * *",
};
