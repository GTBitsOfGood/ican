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

    // set cookie
    res.setHeader(
      "Set-Cookie",
      `auth_token=${token}; Path=/; HttpOnly; Max-Age=10800; SameSite=Strict`,
    );

    res.status(201).json({});
  } catch (error) {
    if (error instanceof Error) {
      return res.status(getStatusCode(error)).json({ error: error.message });
    }
  }
}
