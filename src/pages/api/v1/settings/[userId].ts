import { Settings } from "@/db/models";
import settingsService from "@/services/settings";
import { ApiError } from "@/types/exceptions";
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

        res.status(200).json(settings);
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
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

        res.status(204).end();
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
