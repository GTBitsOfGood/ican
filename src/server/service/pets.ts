import { AlreadyExistsError, CustomError } from "@/utils/types/exceptions";
import {
  createPet,
  deletePetByUserId,
  getPetByUserId,
  updatePetByUserId,
} from "../db/actions/pets";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import client from "../db/dbClient";

export interface UpdatePetBody {
  name: string;
}

export interface CreatePetBody {
  name: string;
  userId: string;
}

export async function typedCreatePet(createBody: CreatePetBody): Promise<Pet> {
  // Validate body
  if (
    !createBody ||
    typeof createBody.name !== "string" ||
    createBody.name.trim() === "" ||
    typeof createBody.userId !== "string" ||
    createBody.userId.trim() === ""
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'name' and 'userId' are required and must be non-empty strings.",
    );
  }

  //Check if the user has a pet already
  const db = client.db();

  const existingPet = await db
    .collection("pets")
    .findOne({ userId: new ObjectId(createBody.userId) });

  if (existingPet) {
    throw new AlreadyExistsError("this user already has a pet");
  }

  const newPet = {
    name: createBody.name,
    xpGained: 0,
    xpLevel: 0,
    coins: 0,
    userId: new ObjectId(createBody.userId),
  };

  await createPet(newPet);

  return newPet;
}

export async function getTypedPet(id: string): Promise<Pet | null> {
  const petData = await getPetByUserId(new ObjectId(id));

  if (!petData) {
    throw new CustomError(404, "This user does not have a pet");
  }

  //Convert data to Pet type
  const typedPet: Pet = {
    name: petData.name,
    xpGained: petData.xpGained,
    xpLevel: petData.xpLevel,
    coins: petData.coins,
    userId: petData.userId,
  } as Pet;

  return typedPet;
}

export async function typedUpdatePet(id: string, body: UpdatePetBody) {
  const updateBody: UpdatePetBody = body;
  if (
    !updateBody ||
    typeof updateBody.name !== "string" ||
    updateBody.name.trim() === ""
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'name' is required and must be a non-empty string.",
    );
  }

  const updatedPet = await updatePetByUserId(new ObjectId(id), body.name);

  if (!updatedPet) {
    throw new CustomError(404, "This user does not have a pet");
  }
}

export async function typedDeletePet(id: string) {
  const deletedPet = await deletePetByUserId(new ObjectId(id));

  if (!deletedPet) {
    throw new CustomError(404, "This user does not have a pet");
  }
}
