const handler = async () => {
  const siteUrl = process.env.URL || process.env.SITE_URL || "http://localhost:3000";
  const cronSecret = process.env.CRON_SECRET;

  const response = await fetch(
    `${siteUrl}/api/v1/notifications/cron/check-medications`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-cron-secret": cronSecret || "",
      },
    },
  );

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: response.status });
};

export default handler;

export const config = {
  schedule: "* * * * *",
};
