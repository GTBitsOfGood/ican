import AuthService from "@/services/user";
import { getStatusCode, UnauthorizedError } from "@/types/exceptions";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { authorization } = req.headers;

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }
    const token = authorization.split(" ")[1];

    const decodedToken = await AuthService.validateToken(token);
    return res.status(200).json({ isValid: true, decodedToken: decodedToken });
  } catch (error) {
    if (error instanceof Error) {
      res.status(getStatusCode(error)).json({ error: error.message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
