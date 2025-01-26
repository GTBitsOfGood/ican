import { Pet } from "@/server/db/models";
import {
  getTypedPets,
  typedDeletePet,
  typedUpdatePet,
  UpdatePetBody,
} from "@/server/service/pets";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { userId } = req.query;
  const { method, body } = req;

  if (typeof userId !== "string" || isNaN(Number(userId))) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  try {
    switch (method) {
      case "GET":
        const pet: Pet | null = await getTypedPets(Number(userId));

        // If null response, this user doesn't have a pet
        if (pet) {
          res.status(200).json(pet);
        } else {
          res.status(404).json({ message: "This user doesn't have a pet" });
        }
        break;

      case "PATCH":
        // Validate the request body
        const updateBody: UpdatePetBody = body;
        if (
          !updateBody ||
          typeof updateBody.name !== "string" ||
          updateBody.name.trim() === ""
        ) {
          return res.status(400).json({
            error:
              "Invalid request body: 'name' is required and must be a non-empty string.",
          });
        }

        const updatedPet: Pet | null = await typedUpdatePet(
          Number(userId),
          updateBody.name,
        );

        if (updatedPet) {
          res.status(200).json(updatedPet);
        } else {
          res.status(404).json({ message: "This user doesn't have a pet" });
        }
        break;

      case "DELETE":
        const deletedPet: Pet | null = await typedDeletePet(Number(userId));

        if (deletedPet) {
          res.status(200).json(deletedPet);
        } else {
          res.status(404).json({ message: "This user doesn't have a pet" });
        }
        break;

      default:
        // Method not allowed
        res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
