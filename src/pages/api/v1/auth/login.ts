import UserService from "@/services/user";
import { getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { email, password } = req.body;

  if (method == "POST") {
    try {
      const response = await UserService.validateLogin(email, password);
      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(getStatusCode(error)).json({ error: error.message });
      }
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
