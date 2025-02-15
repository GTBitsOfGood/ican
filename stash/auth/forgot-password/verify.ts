import { NextApiRequest, NextApiResponse } from "next";
import { verifyForgotPasswordCode } from "@/server/services/forgotPasswordCodes";
import { ApiError } from "@/types/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userId, code } = req.body;

  try {
    const token = await verifyForgotPasswordCode(userId, code);
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
