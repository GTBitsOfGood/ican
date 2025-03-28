import MedicationDAO from "@/db/actions/medication";
import {
  ConflictError,
  IllegalOperationError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import { validateParams } from "@/utils/medication";
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
import { Medication } from "@/db/models/medication";
import { Pet } from "@/db/models/pet";
import {
  MedicationCheckInDocument,
  MedicationCheckIn,
} from "@/db/models/medicationCheckIn";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateMedication(medication);

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
    const existingMedication =
      await MedicationDAO.getMedicationById(medicationId);

    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    // check if medication check in already exists and isn't expired

    const existingMedicationCheckIn: MedicationCheckInDocument | null =
      await MedicationDAO.getMedicationCheckIn(medicationId);
    if (existingMedicationCheckIn) {
      const checkIn: MedicationCheckIn =
        existingMedicationCheckIn as MedicationCheckIn;
      if (checkIn.expiration.getTime() <= Date.now()) {
        // delete medication
        await MedicationDAO.deleteMedicationCheckIn(medicationId);
      } else {
        // do nothing if valid
        return;
      }
    }
    // if medication check in doesn't exist or is expired, then create one

    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15);

    MedicationDAO.createMedicationCheckIn(medicationId, expiration);
  }

  static async createMedicationLog(medicationId: string, pin: string) {
    // Validate parameters
    validateParams({ id: medicationId });

    // Check if the pet exists
    const existingMedication: Medication | null =
      await MedicationDAO.getMedicationById(medicationId);

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

    const existingMedicationCheckIn =
      await MedicationDAO.getMedicationCheckIn(medicationId);

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

    await MedicationDAO.deleteMedicationCheckIn(medicationId);

    // find pet
    const existingPet: Pet | null = await PetDAO.getPetByUserId(userId);

    if (!existingPet) {
      throw new NotFoundError("No pet found for the user");
    }

    // add food to pet
    await PetDAO.updatePetByUserId(userId, {
      food: existingPet.food + FOOD_INC,
    });

    // create medication log in
    await MedicationDAO.createMedicationLog(medicationId, new Date());
  }
}
