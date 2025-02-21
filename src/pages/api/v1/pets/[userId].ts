import { Pet } from "@/db/models";
import { petService } from "@/services/pets";
import { AppError, getStatusCode } from "@/types/exceptions";
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
    case "GET":
      try {
        const pet: Pet | null = await petService.getPet(userId);
        return res.status(200).json(pet);
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
        await petService.updatePet(userId, body.name);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof AppError) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
        return res.status(500).json({ error: (error as Error).message });
      }

    case "DELETE":
      try {
        await petService.deletePet(userId);
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
      // Method not allowed
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
