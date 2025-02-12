import { validateJsonWebToken } from "@/services/auth";
import { ApiError } from "@/types/exceptions";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { authorization } = req.headers;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const response = await validateJsonWebToken(authorization as string);
    res.status(200).json(response);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
