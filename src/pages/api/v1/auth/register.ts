import { validateCreateUser } from "@/services/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "@/types/exceptions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, email, password, confirmPassword } = req.body;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
