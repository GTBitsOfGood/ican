import { NextApiRequest, NextApiResponse } from "next";
import ForgotPasswordService from "@/services/forgotPasswordCodes";
import { getStatusCode } from "@/types/exceptions";

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
    const token = await ForgotPasswordService.verifyForgotPasswordCode(
      userId,
      code,
    );
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(getStatusCode(error)).json({ error: error.message });
    }
  }
}
