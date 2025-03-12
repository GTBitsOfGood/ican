import { MedicationModalInfo } from "@/components/modals/medication/medicationModalInfo";
import { MedicationInfo } from "@/types/medication";
import { convertTo24Hour } from "./time";
import { WithId } from "@/types/models";

/**
 * Parses the medication information from type MedicationModalInfo to MedicationInfo, a valid body for API requests to medication
 * @param medicationInfo Medication data provided by '/add-new-medication' route form
 * @returns Object of type MedicationInfo
 */
const parseModalMedication = (
  medicationInfo: MedicationModalInfo,
): MedicationInfo | WithId<MedicationInfo> => {
  const info = {
    formOfMedication: medicationInfo.general.form,
    medicationId: medicationInfo.general.medicationId,

    repeatInterval: medicationInfo.repetition.repeatEvery || 1,
    repeatUnit: medicationInfo.repetition.type,
    repeatWeeklyOn: medicationInfo.repetition.weeklyRepetition,
    repeatMonthlyType: medicationInfo.repetition.monthlyRepetition,
    repeatMonthlyOnDay: medicationInfo.repetition.monthlyDayOfRepetition,
    repeatMonthlyOnWeek: medicationInfo.repetition.monthlyWeekOfRepetition,
    repeatMonthlyOnWeekDay:
      medicationInfo.repetition.monthlyWeekDayOfRepetition,

    dosesUnit: medicationInfo.dosage.type,
    dosesPerDay: medicationInfo.dosage.dosesPerDay,
    doseIntervalInHours: medicationInfo.dosage.hourlyInterval,
    dosageAmount: medicationInfo.dosage.amount,
    doseTimes: convertTo24Hour(medicationInfo.times),

    notificationFrequency: medicationInfo.dosage.notificationFrequency,
    notes: medicationInfo.notes,
  };
  if (medicationInfo._id) {
    return { _id: medicationInfo._id, ...info } as WithId<MedicationInfo>;
  } else {
    return info as MedicationInfo;
  }
};

export default parseModalMedication;
