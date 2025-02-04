import { Pet } from "@/server/db/models";
import { getPet, deletePet, updatePet } from "@/server/service/pets";
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

  try {
    switch (method) {
      case "GET":
        try {
          const pet: Pet | null = await getPet(userId);
          res.status(200).json(pet);
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      case "PATCH":
        try {
          await updatePet(userId, body.name);
          res.status(204).end();
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      case "DELETE":
        try {
          await deletePet(userId);
          res.status(204).end();
        } catch (error) {
          if (error instanceof ApiError) {
            res.status(error.statusCode).json({ error: error.message });
          } else {
            throw error;
          }
        }

        break;

      default:
        // Method not allowed
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).end({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
