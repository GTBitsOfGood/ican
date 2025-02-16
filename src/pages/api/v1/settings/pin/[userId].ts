import { updatePin } from "@/services/settings";
import { ApiError } from "@/types/exceptions";
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
        await updatePin({ userId, pin: body.pin });

        res.status(204).end();
      } catch (error) {
        if (error instanceof ApiError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    default:
      res.setHeader("Allow", ["PATCH"]);
      res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
