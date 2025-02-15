import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { Pet } from "@/db/models";
import { createPet, getPet, updatePet, deletePet } from "../services/pets";

export class petController {
  public async createPet(req: NextApiRequest, res: NextApiResponse) {
    // Check this over? Shouldn't userId be in params
    const { userId, name } = req.body;
    const createdPet: Pet = await createPet(userId, name);
    return res.status(200).json(createdPet);
  }

  public async getPet(req: NextApiRequest, res: NextApiResponse) {
    // Same here, going to parse into params
    const { userId } = req.body;
    const pet: Pet | null = await getPet(userId);
    return res.status(200).json(pet);
  }

  public async updatePet(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name } = req.body;
    await updatePet(userId, name);
    return res.status(204).end();
  }

  public async deletePet(req: NextApiRequest, res: NextApiResponse) {
    const { userId } = req.body;
    await deletePet(userId);
    return res.status(204).end();
  }
}
