import Ably from "ably";

let restClient: Ably.Rest | null = null;

const env = process.env.NODE_ENV || "development";

export function getChannelName(userId: string): string {
  return `notifications:${env}:${userId}`;
}

export function getAblyRestClient(): Ably.Rest {
  if (!restClient) {
    restClient = new Ably.Rest({ key: process.env.ABLY_API_KEY! });
  }
  return restClient;
}

export async function publishToUser(
  userId: string,
  eventName: string,
  data: Record<string, unknown>,
): Promise<void> {
  const client = getAblyRestClient();
  const channel = client.channels.get(getChannelName(userId));
  await channel.publish(eventName, data);
}

export async function createTokenRequest(
  userId: string,
): Promise<Ably.TokenRequest> {
  const client = getAblyRestClient();
  const channelName = getChannelName(userId);
  return await client.auth.createTokenRequest({
    clientId: userId,
    capability: { [channelName]: ["subscribe"] },
  });
}
