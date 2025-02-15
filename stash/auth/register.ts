import { validateCreateUser } from "@/server/services/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "@/types/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { name, email, password, confirmPassword } = req.body;

  try {
    if (method == "POST") {
      try {
        const response = await validateCreateUser(
          name,
          email,
          password,
          confirmPassword,
        );
        res.status(201).json(response);
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } else {
      // Method not allowed
      res.setHeader("Allow", ["POST"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
