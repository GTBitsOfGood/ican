import { NextApiRequest, NextApiResponse } from "next";
import { generateForgotPasswordCodeForUser } from "@/server/service/forgotPasswordCodes";
import { getUserIdFromEmail } from "@/server/service/user";
import { ApiError } from "@/utils/errors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email } = req.body;

  try {
    const userId = await getUserIdFromEmail(email);
    await generateForgotPasswordCodeForUser(userId);
    return res.status(200).json({ userId });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
