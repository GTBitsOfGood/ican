import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { Pet } from "@/db/models";
import { createPet, getPet, updatePet, deletePet } from "../services/pets";

export class petsController {
  public static async createPet(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name } = req.body;
    const createdPet: Pet = await createPet(userId, name);
    return res.status(200).json(createdPet);
  }

  // I honestly have no good way of getting userId, I can do last index of the
  public static async getPet(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string,
  ) {
    const pet: Pet | null = await getPet(userId);
    return res.status(200).json(pet);
  }

  public static async updatePet(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string,
  ) {
    const { name } = req.body;
    await updatePet(userId, name);
    return res.status(204).end();
  }

  public static async deletePet(
    req: NextApiRequest,
    res: NextApiResponse,
    userId: string,
  ) {
    await deletePet(userId);
    return res.status(204).end();
  }
}
