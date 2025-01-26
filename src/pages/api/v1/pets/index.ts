import { Pet } from "@/server/db/models";
import { CreatePetBody, typedCreatePet } from "@/server/service/pets";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;

  try {
    switch (method) {
      case "POST":
        const createBody: CreatePetBody = body;

        if (
          !createBody ||
          typeof createBody.name !== "string" ||
          createBody.name.trim() === "" ||
          isNaN(Number(createBody.userId))
        ) {
          return res.status(400).json({
            error:
              "Invalid request body: 'name' is required and must be a non-empty string, 'userId' is required and must be a number.",
          });
        }

        const createdPet: Pet = await typedCreatePet(
          Number(createBody.userId),
          createBody.name,
        );

        res.status(200).json(createdPet);
        break;

      default:
        // Method not allowed
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
