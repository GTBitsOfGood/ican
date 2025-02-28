import SettingsService from "@/services/settings";
import { getStatusCode } from "@/types/exceptions";
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
        await SettingsService.updatePin(userId as string, body.pin);

        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }
    default:
      res.setHeader("Allow", ["PATCH"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
