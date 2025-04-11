import MedicationDAO from "@/db/actions/medication";
import {
  ConflictError,
  IllegalOperationError,
  NotFoundError,
} from "@/types/exceptions";
import {
  validateCreateMedication,
  validateDeleteMedication,
  validateGetMedication,
  validateGetMedications,
  validateUpdateMedication,
  processDoseTime,
  validateCreateMedicationCheckIn,
  validateCreateMedicationLog,
  shouldScheduleMedication,
  validateGetMedicationsSchedule,
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Medication } from "@/db/models/medication";
import { MedicationCheckInDocument } from "@/db/models/medicationCheckIn";
import { getCurrentDateByTimezone } from "@/utils/date";
import SettingsService from "./settings";
import { UnauthorizedError } from "@/types/exceptions";
import { Pet } from "@/db/models/pet";
import { FOOD_INC } from "@/utils/constants";
import { validatePins } from "@/utils/settings";
import PetDAO from "@/db/actions/pets";

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
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND.MEDICATION);
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
      throw new ConflictError(ERRORS.MEDICATION.NOT_FOUND.MEDICATION);
    }

    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(id, updatedMedication);
    }
  }

  static async deleteMedication(id: string): Promise<void> {
    validateDeleteMedication({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);

    if (!existingMedication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND.MEDICATION);
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

  static async createMedicationCheckIn(medicationId: string, timezone: string) {
    validateCreateMedicationCheckIn(medicationId, timezone);

    const medication = await MedicationDAO.getMedicationById(medicationId);
    if (!medication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND.MEDICATION);
    }

    const logs = await MedicationDAO.getMedicationLogs(medicationId);
    const currentDate = getCurrentDateByTimezone(timezone);

    const canCheckIn = medication.doseTimes.some((doseTime) => {
      const [doseHour, doseMinute] = doseTime.split(":").map(Number);
      const scheduledDoseTime = new Date(currentDate);
      scheduledDoseTime.setHours(doseHour);
      scheduledDoseTime.setMinutes(doseMinute);

      const { canCheckIn } = processDoseTime(
        scheduledDoseTime,
        currentDate,
        logs,
        timezone,
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

  static async createMedicationLog(
    medicationId: string,
    pin: string,
    timezone: string,
  ) {
    validateCreateMedicationLog(medicationId, pin, timezone);

    const medication: Medication | null =
      await MedicationDAO.getMedicationById(medicationId);

    if (!medication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND.MEDICATION);
    }

    const userId = medication.userId.toString();
    const settings = await SettingsService.getSettings(userId);

    if (!settings || !settings.pin) {
      throw new NotFoundError(ERRORS.SETTINGS.NOT_FOUND.PIN);
    }

    if (!(await validatePins(settings.pin, pin))) {
      throw new UnauthorizedError(ERRORS.SETTINGS.UNAUTHORIZED.VERIFY_PIN);
    }

    const checkIn = await MedicationDAO.getMedicationCheckIn(medicationId);

    if (!checkIn) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND.CHECK_IN);
    }

    const logs = await MedicationDAO.getMedicationLogs(medicationId);
    const currentDate = getCurrentDateByTimezone(timezone);

    const canCheckIn = medication.doseTimes.some((doseTime) => {
      const [doseHour, doseMinute] = doseTime.split(":").map(Number);
      const scheduledDoseTime = new Date(currentDate);
      scheduledDoseTime.setHours(doseHour);
      scheduledDoseTime.setMinutes(doseMinute);

      const { canCheckIn } = processDoseTime(
        scheduledDoseTime,
        currentDate,
        logs,
        timezone,
      );

      return canCheckIn;
    });

    await MedicationDAO.deleteMedicationCheckIn(medicationId);

    if (!canCheckIn) {
      throw new IllegalOperationError("Cannot log medication right now.");
    }

    const existingPet: Pet | null = await PetDAO.getPetByUserId(userId);

    if (!existingPet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    await PetDAO.updatePetByUserId(userId, {
      food: existingPet.food + FOOD_INC,
    });

    await MedicationDAO.createMedicationLog(medicationId, new Date());
  }

  static async getMedicationsSchedule(
    userId: string,
    date: string,
    timezone: string,
  ) {
    validateGetMedicationsSchedule(userId, date, timezone);

    const medications = await this.getMedications(userId);

    if (medications.length == 0) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND_USER);
    }

    const currentDate = getCurrentDateByTimezone(timezone);
    const allDoses = [];

    for (const medication of medications) {
      const logs = await MedicationDAO.getMedicationLogs(medication._id);

      const lastLog = logs.length > 0 ? logs[0] : null;
      const lastTaken = lastLog ? lastLog.dateTaken : null;
      const medicationCreated = medication.createdAt;
      medicationCreated.setUTCHours(0, 0, 0, 0);

      const shouldSchedule = shouldScheduleMedication(
        medication,
        currentDate,
        medicationCreated,
      );

      if (shouldSchedule) {
        for (const time of medication.doseTimes) {
          const [doseHour, doseMinute] = time.split(":").map(Number);
          const scheduledDoseTime = new Date(currentDate);
          scheduledDoseTime.setHours(doseHour);
          scheduledDoseTime.setMinutes(doseMinute);
          const doseResult = processDoseTime(
            scheduledDoseTime,
            currentDate,
            logs,
            timezone,
          );

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
      date: currentDate,
      medications: allDoses,
    };

    return medicationSchedule;
  }
}
