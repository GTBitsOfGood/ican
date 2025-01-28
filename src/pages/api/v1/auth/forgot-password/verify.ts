import { NextApiRequest, NextApiResponse } from "next";
import { verifyForgotPasswordCode } from "@/server/service/forgotPasswordCodes";
import { ObjectId } from "mongodb";
import ApiError from "@/services/apiError";

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
    const token = await verifyForgotPasswordCode(
      new ObjectId(userId as string),
      code,
    );
    return res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Unknown error occured." });
  }
}
