import { updatePin } from "@/services/settings";
import { ApiError } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;
  const { method, body } = req;

  if (typeof userId !== "string") {
    return res.status(400).json({ error: "userId must be a string" });
  }

  switch (method) {
    case "PATCH":
      try {
        if (!userId) {
          return res.status(400).json({ message: "Invalid user id" });
        }
        await updatePin({ userId, ...body });

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
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
