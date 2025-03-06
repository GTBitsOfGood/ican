import { MedicationCheckIn, MedicationLog, Pet } from "@/db/models";
import MedicationDAO from "@/db/actions/medication";
import { removeUndefinedKeys } from "@/lib/utils";
import {
  ConflictError,
  IllegalOperationError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import { validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";
import { validatePins } from "@/utils/settings";
import { FOOD_INC } from "@/utils/constants";
import PetDAO from "@/db/actions/pets";
import SettingsService from "./settings";
import {
  validateCreateMedication,
  validateDeleteMedication,
  validateGetMedication,
  validateGetMedications,
  validateUpdateMedication,
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Types } from "mongoose";
import { Medication } from "@/db/models/medication";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateMedication(medication);
    medication.userId = new Types.ObjectId(medication.userId);

    const existingMedication =
      await MedicationDAO.getUserMedicationByMedicationId(
        medication.medicationId,
        medication.userId,
      );
    if (existingMedication) {
      throw new ConflictError(ERRORS.MEDICATION.CONFLICT);
    }

    const newMedication = await MedicationDAO.createNewMedication(medication);
    return newMedication._id.toString();
  }

  static async getMedication(id: string): Promise<WithId<Medication>> {
    validateGetMedication({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND);
    }
    return {
      ...existingMedication.toObject(),
      _id: existingMedication._id.toString(),
    };
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication); // Need to test this with zod
    validateUpdateMedication({ id, ...updatedMedication });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new ConflictError(ERRORS.MEDICATION.NOT_FOUND);
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(id, updatedMedication);
    }
  }

  static async deleteMedication(id: string): Promise<void> {
    validateDeleteMedication({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);

    if (!existingMedication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND);
    }

    await MedicationDAO.deleteMedicationById(id);
  }

  static async getMedications(userId: string): Promise<WithId<Medication>[]> {
    validateGetMedications({ userId });

    const medications = await MedicationDAO.getMedicationsByUserId(userId);

    return medications.map((medication) => ({
      ...medication.toObject(),
      _id: medication._id.toString(),
    }));
  }

  static async createMedicationCheckIn(medicationId: string) {
    // Validate parameters
    validateParams({ id: medicationId });

    // Check if the medication exists
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(medicationId),
    );

    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    // check if medication check in already exists and isn't expired

    const existingMedicationCheckIn = await MedicationDAO.getMedicationCheckIn(
      new ObjectId(medicationId),
    );

    if (existingMedicationCheckIn) {
      const checkIn = existingMedicationCheckIn as MedicationCheckIn;
      if (checkIn.expiration.getTime() <= Date.now()) {
        // delete medication
        await MedicationDAO.deleteMedicationCheckIn(new ObjectId(medicationId));
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

    MedicationDAO.createMedicationCheckIn(medicationCheckIn);
  }

  static async createMedicationLog(medicationId: string, pin: string) {
    // Validate parameters
    validateParams({ id: medicationId });

    // Check if the pet exists
    const existingMedication = (await MedicationDAO.getMedicationById(
      new ObjectId(medicationId),
    )) as Medication;

    if (!existingMedication || !existingMedication.userId) {
      throw new NotFoundError("This medication does not exist");
    }

    const userId = existingMedication.userId.toString();

    const settings = await SettingsService.getSettings(userId);

    // check if pin related to userid is the same as the pin sent through the request body

    if (!(await validatePins(settings.pin, pin))) {
      throw new UnauthorizedError("Pin is invalid");
    }

    // check if medication exists

    const existingMedicationCheckIn = await MedicationDAO.getMedicationCheckIn(
      new ObjectId(medicationId),
    );

    if (!existingMedicationCheckIn) {
      throw new NotFoundError(
        "There is no check in associated with this medication for this user.",
      );
    }

    const checkIn = existingMedicationCheckIn as MedicationCheckIn;
    if (checkIn.expiration.getTime() <= Date.now()) {
      // throw timeout error
      throw new IllegalOperationError("The provided check in has expired.");
    }

    // delete medication check in

    await MedicationDAO.deleteMedicationCheckIn(new ObjectId(medicationId));

    // find pet
    const existingPet = (await PetDAO.getPetByUserId(
      new ObjectId(userId),
    )) as Pet;

    // add food to pet
    await PetDAO.updatePetByUserId(new ObjectId(userId), {
      food: existingPet.food + FOOD_INC,
    });

    const medicationCheckIn: MedicationLog = {
      medicationId: new ObjectId(medicationId),
      dateTaken: new Date(),
    };

    // create medication log in
    await MedicationDAO.createMedicationLog(medicationCheckIn);
  }
}
