import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { useUser } from "@/components/UserContext";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationBaseModal from "./baseModal";
import { useRouter } from "next/navigation";
import { MedicationInfo } from "@/types/medication";

export const initialAddMedicationInfo: MedicationInfo = {
  formOfMedication: undefined,
  customMedicationId: "",
  repeatUnit: undefined,
  repeatInterval: undefined,
  repeatWeeklyOn: [],
  repeatMonthlyType: undefined,
  repeatMonthlyOnDay: undefined,
  repeatMonthlyOnWeek: undefined,
  repeatMonthlyOnWeekDay: undefined,
  dosesUnit: undefined,
  dosesPerDay: undefined,
  doseIntervalInHours: undefined,
  dosageAmount: "",
  doseTimes: [],
  includeTimes: true,
  notificationFrequency: undefined,
  notes: "",
};

export default function AddMedicationModal() {
  const router = useRouter();
  const { userId } = useUser();

  const onSubmit = async (addMedicationInfo: MedicationInfo) => {
    if (!userId) {
      throw new UnauthorizedError(
        "User ID is missing. Please make sure you're logged in.",
      );
    }
    await MedicationHTTPClient.createMedication(
      userId as string,
      addMedicationInfo,
    );
    router.push("/");
  };

  return (
    <MedicationBaseModal
      modalType="Add"
      onSubmit={onSubmit}
      initialInfo={initialAddMedicationInfo}
    />
  );
}
