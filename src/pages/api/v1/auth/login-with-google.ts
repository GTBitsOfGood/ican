import AuthService from "@/services/auth";
import { getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, email } = req.body;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const token = await AuthService.loginWithGoogle(name, email);
    res.status(201).json({ token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(getStatusCode(error)).json({ error: error.message });
    }
  }
}
