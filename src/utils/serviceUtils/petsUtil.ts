import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";
import { PetType } from "@/types/pet";

const isValidPetType = (petType: string): boolean => {
  return Object.values(PetType).includes(petType as PetType);
};

export const createPetSchema = z.object({
  userId: objectIdSchema,

  name: z.string().trim().nonempty(),

  petType: z.string().refine(isValidPetType, {
    message: "Nonvalid pet type",
  }),
});

export const updatePetSchema = z.object({
  userId: objectIdSchema,

  name: z.string().trim().nonempty(),
});

export const getPetSchema = z.object({
  userId: objectIdSchema,
});

export const deletePetSchema = z.object({
  userId: objectIdSchema,

  name: z.string().trim().nonempty(),
});

export type CreatePetInput = z.infer<typeof createPetSchema>;
export type UpdatePetInput = z.infer<typeof updatePetSchema>;
export type GetPetInput = z.infer<typeof getPetSchema>;
export type DeletePetInput = z.infer<typeof deletePetSchema>;

export const validateCreatePet = (data: unknown): CreatePetInput => {
  return createPetSchema.parse(data);
};

export const validateUpdatePet = (data: unknown): UpdatePetInput => {
  return updatePetSchema.parse(data);
};

export const validateGetPet = (data: unknown): GetPetInput => {
  return getPetSchema.parse(data);
};

export const validateDeletePet = (data: unknown): DeletePetInput => {
  return deletePetSchema.parse(data);
};
