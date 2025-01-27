import { NextApiRequest, NextApiResponse } from "next";
import { generateForgotPasswordCodeForUser } from "@/server/service/forgotPasswordCodes";
import { getUserIdFromEmail } from "@/server/service/user";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Invalid email." });
  }

  const userId = await getUserIdFromEmail(email);
  if (!userId) {
    return res.status(400).json({ error: "User not found." });
  }

  try {
    await generateForgotPasswordCodeForUser(userId);
    return res.status(200).json({ userId });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
