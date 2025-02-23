import { NextApiRequest, NextApiResponse } from "next";
import { AppError, getStatusCode } from "@/types/exceptions";
import ForgotPasswordService from "@/services/forgotPasswordCodes";

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
    const userId = await ForgotPasswordService.sendPasswordCode(email);
    return res.status(200).json({ userId });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(getStatusCode(error)).json({ error: error.message });
    }
    return res.status(500).json({ error: (error as Error).message });
  }
}
