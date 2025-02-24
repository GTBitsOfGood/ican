import { validateGoogleLogin } from "@/services/auth";
import { ApiError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { name, email } = req.body;

  if (method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
    return;
  }

  try {
    const token = await validateGoogleLogin(name, email);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(getStatusCode(error)).json({ error: error.message });
    } else {
      res.status(500).json({
        error: (error as Error).message || "An unknown error occurred",
      });
    }
  }
}
