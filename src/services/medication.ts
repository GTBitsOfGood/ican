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
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Medication } from "@/db/models/medication";
import { Pet } from "@/db/models/pet";
import {
  MedicationCheckInDocument,
  MedicationCheckIn,
} from "@/db/models/medicationCheckIn";
import { DoseObject, MedicationSchedule } from "@/types/medication";
import { DAYS_OF_WEEK } from "@/lib/consts";

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

  static async getMedicationsSchedule(userId: string, date: string) {
    validateGetMedicationsSchedule({ userId, date });

    const medications = await this.getMedications(userId);

    if (!medications) {
      throw new NotFoundError("User does not have any medications");
    }

    const givenDate = new Date(date);
    const givenDateTime = givenDate.getTime();

    const doses = await Promise.all(
      medications.map(async (medication): Promise<DoseObject | null> => {
        const medicationLogs = await MedicationDAO.getMedicationLogs(
          medication._id,
        );

        let scheduledTimes: {
          time: string;
          status: "pending" | "taken" | "missed";
        }[] = [];

        const isNewMedication = medicationLogs.length === 0;

        const lastLog = medicationLogs.length > 0 ? medicationLogs[0] : null;
        const lastTaken = lastLog ? lastLog.dateTaken : null;
        const lastTakenDate = lastTaken ? lastTaken.getTime() : 0;

        let shouldSchedule = false;

        if (medication.repeatUnit === "Day") {
          if (isNewMedication) {
            shouldSchedule = true;
          } else {
            const daysApart = Math.ceil(
              (givenDateTime - lastTakenDate) / 86400000,
            );
            shouldSchedule = daysApart % (medication.repeatInterval ?? 1) === 0;
          }
        } else if (medication.repeatUnit === "Week") {
          const givenDayOfWeek = DAYS_OF_WEEK[givenDate.getDay()];
          const isDayScheduled =
            medication.repeatWeeklyOn &&
            medication.repeatWeeklyOn.includes(givenDayOfWeek);

          if (isNewMedication) {
            shouldSchedule = isDayScheduled;
          } else if (isDayScheduled) {
            const weeksApart = Math.ceil(
              (givenDateTime - lastTakenDate) / (86400000 * 7),
            );
            shouldSchedule =
              weeksApart % (medication.repeatInterval ?? 1) === 0;
          }
        } else if (medication.repeatUnit === "Month") {
          if (medication.repeatMonthlyType === "Day") {
            const scheduledDayOfMonth = medication.repeatMonthlyOnDay;
            const givenDayOfMonth = givenDate.getDate();

            if (givenDayOfMonth === scheduledDayOfMonth) {
              if (isNewMedication) {
                shouldSchedule = true;
              } else {
                const lastTakenMonth = lastTaken ? lastTaken.getMonth() : 0;
                const lastTakenYear = lastTaken ? lastTaken.getFullYear() : 0;
                const givenMonth = givenDate.getMonth();
                const givenYear = givenDate.getFullYear();

                const monthsApart =
                  (givenYear - lastTakenYear) * 12 +
                  (givenMonth - lastTakenMonth);
                shouldSchedule =
                  monthsApart % (medication.repeatInterval ?? 1) === 0;
              }
            }
          } else if (medication.repeatMonthlyType === "Week") {
            const scheduledWeekOfMonth = medication.repeatMonthlyOnWeek;
            const scheduledDayOfWeek = medication.repeatMonthlyOnWeekDay;

            const firstDayOfMonth = new Date(givenDate);
            firstDayOfMonth.setDate(1);

            const givenDayOfWeek = DAYS_OF_WEEK[givenDate.getDay()];
            const givenDayOfMonth = givenDate.getDate();

            let weekOfMonth = Math.ceil(givenDayOfMonth / 7);

            if (scheduledWeekOfMonth === 5) {
              const lastDayOfMonth = new Date(
                givenDate.getFullYear(),
                givenDate.getMonth() + 1,
                0,
              );
              const daysUntilEndOfMonth =
                lastDayOfMonth.getDate() - givenDayOfMonth;

              if (daysUntilEndOfMonth < 7) {
                weekOfMonth = 5;
              }
            }

            if (
              givenDayOfWeek === scheduledDayOfWeek &&
              weekOfMonth === scheduledWeekOfMonth
            ) {
              if (isNewMedication) {
                shouldSchedule = true;
              } else {
                const lastTakenMonth = lastTaken ? lastTaken.getMonth() : 0;
                const lastTakenYear = lastTaken ? lastTaken.getFullYear() : 0;
                const givenMonth = givenDate.getMonth();
                const givenYear = givenDate.getFullYear();

                const monthsApart =
                  (givenYear - lastTakenYear) * 12 +
                  (givenMonth - lastTakenMonth);
                shouldSchedule =
                  monthsApart % (medication.repeatInterval ?? 1) === 0;
              }
            }
          }
        }

        if (shouldSchedule) {
          if (medication.doseIntervalInHours) {
            const startDoseTime = medication.doseTimes[0];
            const [startHour, startMinute] = startDoseTime
              .split(":")
              .map(Number);

            const endHour = 21;

            let currentHour = startHour;
            let currentMinute = startMinute;

            while (currentHour < endHour) {
              const timeStr = `${currentHour.toString().padStart(2, "0")}:${currentMinute.toString().padStart(2, "0")}`;

              let status: "pending" | "taken" | "missed" = "pending";

              const doseTime = new Date(date + "T00:00:00");
              doseTime.setHours(currentHour, currentMinute, 0, 0);

              const matchingLog = medicationLogs.find((log) => {
                const logDate = new Date(log.dateTaken);
                return (
                  Math.abs(logDate.getTime() - doseTime.getTime()) <= 600000 // Within 10 minutes
                );
              });

              if (matchingLog) {
                status = "taken";
              } else {
                const now = new Date();
                if (
                  doseTime < now &&
                  doseTime.toDateString() === now.toDateString()
                ) {
                  status = "missed";
                }
              }

              scheduledTimes.push({
                time: timeStr,
                status,
              });

              // Move to next interval
              currentHour += medication.doseIntervalInHours;

              // Handle if adding hours pushes minutes past 60
              if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
              }
            }
          } else {
            scheduledTimes = medication.doseTimes.map((time) => {
              let status: "pending" | "taken" | "missed" = "pending";
              const [hours, minutes] = time.split(":").map(Number);

              const doseTime = new Date(date + "T00:00:00");
              doseTime.setHours(hours, minutes, 0, 0);

              const matchingLog = medicationLogs.find((log) => {
                const logDate = new Date(log.dateTaken);
                return (
                  Math.abs(logDate.getTime() - doseTime.getTime()) <= 600000
                );
              });

              if (matchingLog) {
                status = "taken";
              } else {
                const now = new Date();
                if (
                  doseTime < now &&
                  doseTime.toDateString() === now.toDateString()
                ) {
                  status = "missed";
                }
              }

              return {
                time,
                status,
              };
            });
          }

          const dose = {
            id: medication._id,
            name: medication.medicationId,
            dosage: medication.dosageAmount,
            notes: medication.notes,
            scheduledTimes: scheduledTimes,
            lastTaken: lastTaken,
            repeatUnit: medication.repeatUnit as string,
            repeatInterval: medication.repeatInterval as number,
          };

          return dose;
        }

        return null;
      }),
    );

    const validDoses = doses.filter(Boolean) as DoseObject[];

    if (validDoses.length === 0) {
      throw new NotFoundError("No medications scheduled for this date");
    }

    const medicationSchedule: MedicationSchedule = {
      date: givenDate,
      medications: validDoses as DoseObject[],
    };

    return medicationSchedule;
  }
}
