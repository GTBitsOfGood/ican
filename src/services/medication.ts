import {
  createMedicationCheckInAction,
  createMedicationLogAction,
  deleteMedicationCheckInAction,
  getMedicationById,
  getMedicationCheckInAction,
} from "@/db/actions/medication";
import { Medication, MedicationCheckIn, MedicationLog, Pet } from "@/db/models";
import { DoesNotExistError, InvalidBodyError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";
import { Medication } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { validateCreateParams, validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";
import { getSettings } from "./settings";
import { validatePins } from "@/utils/settings";
import { updatePet } from "./pets";
import { getPetByUserId } from "@/db/actions/pets";
import { FOOD_INC } from "@/utils/constants";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateParams(medication);
    medication.userId = new ObjectId(medication.userId);

    const existingMedication =
      await MedicationDAO.getUserMedicationByMedicationId(
        medication.medicationId,
        medication.userId,
      );
    if (existingMedication) {
      throw new ConflictError("This medication already exists");
    }

    const newMedication = await MedicationDAO.createNewMedication(medication);
    return newMedication.insertedId.toString();
  }

  static async getMedication(id: string): Promise<Medication> {
    await validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    return existingMedication as Medication;
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication);
    await validateParams(updatedMedication);
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new ConflictError("This medication does not exist");
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(
        new ObjectId(id),
        updatedMedication,
      );
    }
  }

  static async deleteMedication(id: string) {
    validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    await MedicationDAO.deleteMedicationById(new ObjectId(id));
  }

  static async getMedications(userId: ObjectId) {
    validateParams({ userId });
    const medications = await MedicationDAO.getMedicationsByUserId(
      new ObjectId(userId),
    );
    if (!medications) {
      throw new NotFoundError(
        "This user id does not have connected medications",
      );
    }
    return (await medications.toArray()) as Array<Medication>;
  }
}

export async function createMedicationCheckIn(medicationId: string) {
  // Validate parameters
  validateParams({ id: medicationId });

  // Check if the medication exists
  const existingMedication = await getMedicationById(
    new ObjectId(medicationId),
  );

  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }
  // check if medication check in already exists and isn't expired

  const existingMedicationCheckIn = await getMedicationCheckInAction(
    new ObjectId(medicationId),
  );

  if (existingMedicationCheckIn) {
    const checkIn = existingMedicationCheckIn as MedicationCheckIn;
    if (checkIn.expiration.getTime() > Date.now()) {
      // delete medication
      await deleteMedicationCheckInAction(new ObjectId(medicationId));
    } else {
      // do nothing if valid
      return;
    }
  }
  // if medication check in doesn't exist or is expired, then create one

  const expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 15);

  const medicationCheckIn: MedicationCheckIn = {
    medicationId: new ObjectId(medicationId),
    expiration,
  };

  createMedicationCheckInAction(medicationCheckIn);
}

export async function createMedicationLog(medicationId: string, pin: string) {
  // Validate parameters
  validateParams({ id: medicationId });

  // Check if the pet exists
  const existingMedication = (await getMedicationById(
    new ObjectId(medicationId),
  )) as Medication;

  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }

  const userId = existingMedication.userId.toString();

  const settings = await getSettings({
    userId,
  });

  console.log(pin);

  // check if pin related to userid is the same as the pin sent through the request body

  if (!(await validatePins(settings.pin, pin))) {
    throw new InvalidBodyError("Pin is invalid");
  }

  // check if medication exists

  const existingMedicationCheckIn = await getMedicationCheckInAction(
    new ObjectId(medicationId),
  );

  if (!existingMedicationCheckIn) {
    throw new InvalidBodyError(
      "There is no check in associated with this medication for this user.",
    );
  }

  const checkIn = existingMedicationCheckIn as MedicationCheckIn;
  if (checkIn.expiration.getTime() <= Date.now()) {
    // throw timeout error
    throw new InvalidBodyError("The provided check in has expired.");
  }

  // delete medication check in

  await deleteMedicationCheckInAction(new ObjectId(medicationId));

  // find pet
  const existingPet = (await getPetByUserId(new ObjectId(userId))) as Pet;

  // add food to pet
  await updatePet(userId, { food: existingPet.food + FOOD_INC });

  const medicationCheckIn: MedicationLog = {
    medicationId: new ObjectId(medicationId),
    dateTaken: new Date(),
  };

  // create medication log in
  await createMedicationLogAction(medicationCheckIn);
}
