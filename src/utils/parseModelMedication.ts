import { MedicationModalInfo } from "@/components/modals/medication/medicationModalInfo";
import { Medication } from "@/db/models/medication";
import { DayOfWeek } from "@/lib/consts";
import { WithId } from "@/types/models";
import { convertTo12Hour } from "./time";

export default function parseModelMedication(
  medicationInfo: WithId<Medication>,
): MedicationModalInfo {
  return {
    _id: medicationInfo._id,
    general: {
      form: medicationInfo.formOfMedication as MedicationModalInfo["general"]["form"],
      medicationId: medicationInfo.medicationId,
    },
    repetition: {
      repeatEvery: medicationInfo.repeatInterval,
      type: medicationInfo.repeatUnit as MedicationModalInfo["repetition"]["type"],
      weeklyRepetition: medicationInfo.repeatWeeklyOn as DayOfWeek[],
      monthlyRepetition:
        medicationInfo.repeatMonthlyType as MedicationModalInfo["repetition"]["monthlyRepetition"],
      monthlyDayOfRepetition: medicationInfo.repeatMonthlyOnDay,
      monthlyWeekOfRepetition: medicationInfo.repeatMonthlyOnWeek,
      monthlyWeekDayOfRepetition:
        medicationInfo.repeatMonthlyOnWeekDay as DayOfWeek,
    },
    dosage: {
      amount: medicationInfo.dosageAmount,
      notificationFrequency:
        medicationInfo.notificationFrequency as MedicationModalInfo["dosage"]["notificationFrequency"],
      type: medicationInfo.dosesUnit as MedicationModalInfo["dosage"]["type"],
      hourlyInterval: medicationInfo.doseIntervalInHours,
      dosesPerDay: medicationInfo.dosesPerDay,
    },
    times: convertTo12Hour(medicationInfo.doseTimes),
    includeTimes:
      medicationInfo.dosesUnit != "doses" ||
      medicationInfo.doseTimes.length != 0,
    notes: medicationInfo.notes || "",
  };
}
