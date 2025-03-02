import { Settings } from "@/db/models";
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
    case "GET":
      try {
        const settings: Settings = await SettingsService.getSettings(
          userId as string,
        );

        return res.status(200).json(settings);
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }
    case "PATCH":
      try {
        await SettingsService.updateSettings(userId as string, {
          helpfulTips: body?.helpfulTips,
          largeFontSize: body?.largeFontSize,
          notifications: body?.notifications,
          parentalControl: body?.parentalControl,
        });

        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }
    default:
      res.setHeader("Allow", ["GET", "PATCH"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
