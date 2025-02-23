import { Pet } from "@/db/models";
import PetService from "@/services/pets";
import { AppError, getStatusCode } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;

  if (method == "POST") {
    try {
      const createdPet: Pet = await PetService.createPet(
        body.userId,
        body.name,
        body.petType,
      );
      return res.status(200).json(createdPet);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(getStatusCode(error)).json({ error: error.message });
      }
      return res.status(500).json({ error: (error as Error).message });
    }
  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
