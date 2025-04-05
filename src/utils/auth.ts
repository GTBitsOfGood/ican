import PetDAO from "@/db/actions/pets";
import { UserDocument } from "@/db/models/user";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";

export const verifyUser = (
  tokenUser: UserDocument | null,
  userId: string,
  errorMessage?: string,
): void => {
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
  customMedicationId: string | null,
  errorMessage?: string,
): Promise<void> => {
  return await verifyEntityByUserId(
    userId,
    customMedicationId,
    MedicationDAO.getMedicationById,
    errorMessage,
  );
};

export const verifyMedicationByCustomMedicationId = async (
  userId: UserDocument | string | null,
  customMedicationId: string | null,
  errorMessage?: string,
): Promise<void> => {
  errorMessage = errorMessage || "Unauthorized Request";
  if (!userId || !customMedicationId) {
    throw new UnauthorizedError(errorMessage);
  }

  const userIdString =
    typeof userId === "string" ? userId : userId._id.toString();

  const entity = await MedicationDAO.getUserMedicationByCustomMedicationId(
    customMedicationId,
    userIdString,
  );

  if (!entity || entity.userId.toString() != userIdString) {
    throw new UnauthorizedError(errorMessage);
  }
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
