import NotificationService from "../../src/services/notification";

const handler = async () => {
  const sentCount = await NotificationService.checkAndSendNotifications();
  return new Response(JSON.stringify({ sent: sentCount }), { status: 200 });
};

export default handler;

export const config = {
  schedule: "* * * * *",
};
