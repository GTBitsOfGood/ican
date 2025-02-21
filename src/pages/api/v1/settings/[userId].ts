import { Settings } from "@/db/models";
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
    case "GET":
      try {
        const settings: Settings = await settingsService.getSettings(
          userId as string,
        );

        return res.status(200).json(settings);
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }
    case "PATCH":
      try {
        await settingsService.updateSettings({
          userId: userId as string,
          helpfulTips: body?.helpfulTips,
          largeFontSize: body?.largeFontSize,
          notifications: body?.notifications,
          parentalControl: body?.parentalControl,
        });

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
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
