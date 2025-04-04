import PetDAO from "@/db/actions/pets";
import { UserDocument } from "@/db/models/user";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";
import { objectIdSchema } from "./serviceUtils/commonSchemaUtil";
import ERRORS from "./errorMessages";

export const verifyUser = (
  tokenUser: UserDocument | null,
  userId: string,
  errorMessage?: string,
): void => {
  try {
    objectIdSchema("UserId").parse(userId);
  } catch {
    throw new UnauthorizedError(ERRORS.MEDICATION.INVALID_ARGUMENTS.USER_ID);
  }

  errorMessage = errorMessage || "Unauthorized Request";
  if (!tokenUser || tokenUser._id.toString() != userId) {
    throw new UnauthorizedError(errorMessage);
  }
};

export const verifyPet = async (
  userId: UserDocument | string | null,
  petId: string | null,
  errorMessage?: string,
): Promise<void> => {
  return await verifyEntityByUserId(
    userId,
    petId,
    PetDAO.getPetByPetId,
    errorMessage,
  );
};

export const verifyMedication = async (
  userId: UserDocument | string | null,
  medicationId: string | null,
  errorMessage?: string,
): Promise<void> => {
  return await verifyEntityByUserId(
    userId,
    medicationId,
    MedicationDAO.getMedicationById,
    errorMessage,
  );
};

// Helper function to make creation of functions easier
const verifyEntityByUserId = async <
  T extends { userId: string | { toString(): string } },
>(
  userId: UserDocument | string | null,
  entityId: string | null,
  getEntityById: (id: string) => Promise<T | null>,
  errorMessage?: string,
): Promise<void> => {
  errorMessage = errorMessage || "Unauthorized Request";
  if (!userId || !entityId) {
    throw new UnauthorizedError(errorMessage);
  }

  const entity = await getEntityById(entityId);

  const userIdString =
    typeof userId === "string" ? userId : userId._id.toString();

  if (!entity || entity.userId.toString() != userIdString) {
    throw new UnauthorizedError(errorMessage);
  }
};
