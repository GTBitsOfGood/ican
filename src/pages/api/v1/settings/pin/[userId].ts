import settingsService from "@/services/settings";
import { AppError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;
  const { method, body } = req;

  switch (method) {
    case "PATCH":
      try {
        if (!userId) {
          return res.status(400).json({ message: "Invalid user id" });
        }
        await settingsService.updatePin(userId as string, body.pin);

        return res.status(204).end();
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }
    default:
      res.setHeader("Allow", ["PATCH"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
