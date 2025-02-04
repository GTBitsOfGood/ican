import { NextApiRequest, NextApiResponse } from "next";
import { sendPasswordCode } from "@/server/service/forgotPasswordCodes";
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
    const userId = await sendPasswordCode(email);
    return res.status(200).json({ userId });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
