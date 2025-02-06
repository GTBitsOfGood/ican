import { validateLogin } from "@/services/auth";
import { AppError } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { email, password } = req.body;

  try {
    if (method == "POST") {
      try {
        const response = await validateLogin(email, password);
        res.status(201).json(response);
      } catch (error) {
        if (error instanceof AppError) {
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
