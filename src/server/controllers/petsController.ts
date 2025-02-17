import { NextApiRequest } from "next";
import { NextApiResponse } from "next";
import { Pet } from "@/db/models";
import { createPet, getPet, updatePet, deletePet } from "../services/pets";
import { getProxyParam } from "@/lib/controllerUtils";

export class petsController {
  // api/v1/pets
  public static async createPet(req: NextApiRequest, res: NextApiResponse) {
    const { userId, name } = req.body;
    const createdPet: Pet = await createPet(userId, name);
    return res.status(200).json(createdPet);
  }

  // api/v1/pets/{userId}
  public static async getPet(req: NextApiRequest, res: NextApiResponse) {
    const userId = getProxyParam(req.query.proxy, 1);
    const pet: Pet | null = await getPet(userId);
    return res.status(200).json(pet);
  }

  // api/v1/pets/{userId}
  public static async updatePet(req: NextApiRequest, res: NextApiResponse) {
    const userId = getProxyParam(req.query.proxy, 1);
    const { name } = req.body;
    await updatePet(userId, name);
    return res.status(204).end();
  }

  // api/v1/pets/{userId}
  public static async deletePet(req: NextApiRequest, res: NextApiResponse) {
    const userId = getProxyParam(req.query.proxy, 1);
    await deletePet(userId);
    return res.status(204).end();
  }
}
