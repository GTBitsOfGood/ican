import { Pet } from "@/server/db/models";
import { createPet } from "@/server/service/pets";
import { CustomError } from "@/types/exceptions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method, body } = req;

  try {
    if (method == "POST") {
      try {
        const createdPet: Pet = await createPet(body.userId, body.name);
        res.status(200).json(createdPet);
      } catch (error) {
        if (error instanceof CustomError) {
          res.status(error.statusCode).json({ error: error.message });
        } else {
          throw error;
        }
      }
    } else {
      // Method not allowed
      res.setHeader("Allow", ["POST"]);
      res.status(405).end({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: (error as Error).message || "An unknown error occurred" });
  }
}
