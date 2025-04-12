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
  validateGetMedicationsSchedule,
  validateUpdateMedication,
  shouldScheduleMedication,
  processDoseTime,
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Medication } from "@/db/models/medication";
import { Pet } from "@/db/models/pet";
import { MedicationCheckInDocument } from "@/db/models/medicationCheckIn";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateMedication(medication);

    const existingMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        medication.customMedicationId,
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

  static async updateMedication(
    id: string,
    updatedMedication: Partial<Omit<Medication, "userId">>,
  ) {
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

  static async createMedicationCheckIn(
    medicationId: string,
    localTime: string,
  ) {
    // Validate parameters
    validateParams({ id: medicationId });

    // Check if the medication exists
    const existingMedication =
      await MedicationDAO.getMedicationById(medicationId);

    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }

    const medicationLogs = await MedicationDAO.getMedicationLogs(medicationId);
    const now = new Date(localTime);
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    currentDate.setUTCHours(0, 0, 0, 0);

    const canCheckIn = existingMedication.doseTimes.some((time) => {
      const { canCheckIn } = processDoseTime(
        time,
        currentDate.toISOString(),
        medicationLogs,
      );

      return canCheckIn;
    });

    const existingMedicationCheckIn: MedicationCheckInDocument | null =
      await MedicationDAO.getMedicationCheckIn(medicationId);

    if (!canCheckIn) {
      if (existingMedicationCheckIn) {
        await MedicationDAO.deleteMedicationCheckIn(medicationId);
      }

      throw new IllegalOperationError("Cannot check in right now.");
    }

    if (existingMedicationCheckIn) {
      return;
    }

    MedicationDAO.createMedicationCheckIn(medicationId);
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
    if (!settings.pin) {
      throw new NotFoundError("Pin is not set");
    }
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

    const medicationLogs = await MedicationDAO.getMedicationLogs(medicationId);
    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    currentDate.setUTCHours(0, 0, 0, 0);

    const canCheckIn = existingMedication.doseTimes.some((time) => {
      const { canCheckIn } = processDoseTime(
        time,
        currentDate.toISOString(),
        medicationLogs,
      );

      return canCheckIn;
    });

    await MedicationDAO.deleteMedicationCheckIn(medicationId);

    if (!canCheckIn) {
      throw new IllegalOperationError("Cannot log medication right now.");
    }

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

  static async getMedicationsSchedule(userId: string, date: string) {
    validateGetMedicationsSchedule({ userId, date });

    const medications = await this.getMedications(userId);

    if (medications.length == 0) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND_USER);
    }

    const now = new Date();
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    currentDate.setUTCHours(0, 0, 0, 0);

    const givenDate = new Date(date);

    const allDoses = [];

    for (const medication of medications) {
      const medicationLogs = await MedicationDAO.getMedicationLogs(
        medication._id,
      );

      const lastLog = medicationLogs.length > 0 ? medicationLogs[0] : null;
      const lastTaken = lastLog ? lastLog.dateTaken : null;
      const medicationCreated = medication.createdAt;
      medicationCreated.setUTCHours(0, 0, 0, 0);

      const shouldSchedule = shouldScheduleMedication(
        medication,
        givenDate,
        medicationCreated,
      );

      if (shouldSchedule) {
        for (const time of medication.doseTimes) {
          const doseResult = processDoseTime(time, date, medicationLogs);

          allDoses.push({
            id: medication._id,
            name: medication.customMedicationId,
            dosage: medication.dosageAmount,
            notes: medication.notes,
            canCheckIn: doseResult.canCheckIn,
            scheduledDoseTime: time,
            status: doseResult.status,
            lastTaken: lastTaken,
            repeatUnit: medication.repeatUnit as string,
            repeatInterval: medication.repeatInterval as number,
          });
        }
      }
    }

    const medicationSchedule = {
      date: givenDate,
      medications: allDoses,
    };

    return medicationSchedule;
  }
}
