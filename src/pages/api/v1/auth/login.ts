import AuthService from "@/services/auth";
import { AppError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { email, password } = req.body;

  if (method == "POST") {
    try {
      const response = await AuthService.validateLogin(email, password);
      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(getStatusCode(error)).json({ error: error.message });
      }
      return res.status(500).json({ error: (error as Error).message });
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
