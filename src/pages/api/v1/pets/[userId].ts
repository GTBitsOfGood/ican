import { Pet } from "@/db/models";
import PetService from "@/services/pets";
import { getStatusCode } from "@/types/exceptions";
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
        const pet: Pet | null = await PetService.getPet(userId);
        return res.status(200).json(pet);
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    case "PATCH":
      try {
        await PetService.updatePet(userId, body.name);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    case "DELETE":
      try {
        await PetService.deletePet(userId);
        return res.status(204).end();
      } catch (error) {
        if (error instanceof Error) {
          return res
            .status(getStatusCode(error))
            .json({ error: error.message });
        }
      }

    default:
      // Method not allowed
      res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
