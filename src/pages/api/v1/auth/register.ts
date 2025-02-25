import UserService from "@/services/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { getStatusCode } from "@/types/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { name, email, password, confirmPassword } = req.body;

  if (method == "POST") {
    try {
      const response = await UserService.validateCreateUser(
        name,
        email,
        password,
        confirmPassword,
      );

      return res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(getStatusCode(error)).json({ error: error.message });
      }
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
