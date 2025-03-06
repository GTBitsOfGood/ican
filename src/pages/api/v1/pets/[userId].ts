import { Pet } from "@/db/models";
import { getPet, deletePet, updatePet } from "@/services/pets";
import { ApiError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;
  const { method, body } = req;

  try {
    switch (method) {
      case "GET":
        try {
          const pet: Pet | null = await getPet(userId as string);
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
          await updatePet(userId as string, body.name);
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
          await deletePet(userId as string);
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
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    if (error instanceof ApiError) {
      res
        .status(getStatusCode(error))
        .json({ error: (error as Error).message });
    }
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
