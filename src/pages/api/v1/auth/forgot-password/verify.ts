import { NextApiRequest, NextApiResponse } from "next";
import { verifyForgotPasswordCode } from "@/server/service/forgotPasswordCodes";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, code } = req.body;

  if (!userId || !code) {
    return res.status(400).json({ error: "User ID and code are required." });
  }

  try {
    const token = await verifyForgotPasswordCode(userId, code);
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
