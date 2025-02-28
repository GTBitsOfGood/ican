import {
  createNewMedication,
  deleteMedicationById,
  getMedicationById,
  getMedicationByMedicationId,
  getMedicationsByUserId,
  updateMedicationById,
} from "@/db/actions/medication";
import { Medication } from "@/db/models";
import { AlreadyExistsError, DoesNotExistError } from "@/types/exceptions";
import { UpdateMedicationRequestBody } from "@/types/medication";
import { validateCreateParams, validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";

export async function createMedication({
  formOfMedication,
  medicationId,
  repeatInterval,
  repeatUnit,
  repeatOn,
  repeatMonthlyOnDay,
  notificationFrequency,
  dosesPerDay,
  doseIntervalInHours,
  doseTimes,
  userId,
}: {
  formOfMedication: string;
  medicationId: string;
  repeatInterval: number;
  repeatUnit: string;
  repeatOn: string[];
  repeatMonthlyOnDay: number;
  notificationFrequency: string;
  dosesPerDay: number;
  doseIntervalInHours: number;
  // string of times
  doseTimes: string[];
  userId: string;
}): Promise<string> {
  const medication = {
    formOfMedication,
    medicationId,
    repeatInterval,
    repeatUnit,
    repeatOn,
    repeatMonthlyOnDay,
    notificationFrequency,
    dosesPerDay,
    doseIntervalInHours,
    doseTimes,
    userId,
  };
  await validateCreateParams({
    ...medication,
  });
  const existingMedication = await getMedicationByMedicationId(medicationId);

  if (existingMedication) {
    throw new AlreadyExistsError("this medication already exists");
  }

  const currMedication: Medication = {
    ...medication,
    medicationId: medicationId as string,
    _id: new ObjectId(),
    userId: new ObjectId(userId),
  };

  const newMedication = await createNewMedication(currMedication);

  return newMedication.insertedId.toString();
}

export async function getMedication(id: string): Promise<Medication> {
  await validateParams({ id });

  const existingMedication = await getMedicationById(new ObjectId(id));

  if (!existingMedication) {
    throw new DoesNotExistError("this medication does not exist");
  }

  return existingMedication as Medication;
}

export async function updateMedication(
  id: string,
  {
    formOfMedication,
    medicationId,
    repeatInterval,
    repeatUnit,
    repeatOn,
    repeatMonthlyOnDay,
    notificationFrequency,
    dosesPerDay,
    doseIntervalInHours,
    doseTimes,
  }: {
    formOfMedication?: string;
    medicationId?: string;
    repeatInterval?: number;
    repeatUnit?: string;
    repeatOn?: string[];
    repeatMonthlyOnDay?: number;
    notificationFrequency?: string;
    dosesPerDay?: number;
    doseIntervalInHours?: number;
    // string of times
    doseTimes?: string[];
  },
) {
  // Validate parameters

  const updateObj: UpdateMedicationRequestBody = {};
  if (formOfMedication) updateObj.formOfMedication = formOfMedication;
  if (medicationId) updateObj.medicationId = medicationId;
  if (repeatInterval) updateObj.repeatInterval = repeatInterval;
  if (repeatUnit) updateObj.repeatUnit = repeatUnit;
  if (repeatOn) updateObj.repeatOn = repeatOn;
  if (repeatMonthlyOnDay) updateObj.repeatMonthlyOnDay = repeatMonthlyOnDay;
  if (notificationFrequency)
    updateObj.notificationFrequency = notificationFrequency;
  if (dosesPerDay) updateObj.dosesPerDay = dosesPerDay;
  if (doseIntervalInHours) updateObj.doseIntervalInHours = doseIntervalInHours;
  if (doseTimes) updateObj.doseTimes = doseTimes;

  await validateParams({ ...updateObj });

  // Check if the pet exists
  const existingMedication = await getMedicationById(new ObjectId(id));
  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }

  if (formOfMedication) await updateMedicationById(new ObjectId(id), updateObj);
}

export async function deleteMedication(id: string) {
  // Validate parameters
  validateParams({ id });

  // Check if the pet exists
  const existingMedication = await getMedicationById(new ObjectId(id));
  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }

  await deleteMedicationById(new ObjectId(id));
}

export async function getMedications(userId: string) {
  validateParams({ userId });

  const medications = await getMedicationsByUserId(new ObjectId(userId));
  if (!medications) {
    throw new DoesNotExistError(
      "This user id does not have connected medications",
    );
  }

  const medicationsArray = await medications.toArray();

  return medicationsArray as Array<Medication>;
}
