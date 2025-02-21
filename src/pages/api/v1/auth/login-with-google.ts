import authService from "@/services/auth";
import { AppError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { name, email } = req.body;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }

  try {
    const token = await authService.validateGoogleLogin(name, email);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(getStatusCode(error)).json({ error: error.message });
    }
    return res.status(500).json({ error: (error as Error).message });
  }
}
