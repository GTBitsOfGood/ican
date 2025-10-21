import { useUser } from "@/components/UserContext";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationBaseModal from "./baseModal";
import { useRouter } from "next/navigation";
import { MedicationInfo } from "@/types/medication";
import { useCreateMedication } from "@/components/hooks/useMedication";

interface AddMedicationModalProps {
  medicationIds?: Set<string>;
}

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

export default function AddMedicationModal({
  medicationIds,
}: AddMedicationModalProps) {
  const router = useRouter();
  const { userId } = useUser();
  const createMedicationMutation = useCreateMedication();

  const onSubmit = async (addMedicationInfo: MedicationInfo) => {
    if (!userId) {
      throw new UnauthorizedError(
        "User ID is missing. Please make sure you're logged in.",
      );
    }

    await createMedicationMutation.mutateAsync(addMedicationInfo);
    router.push("/medications");
  };

  return (
    <MedicationBaseModal
      modalType="Add"
      medicationIds={medicationIds}
      onSubmit={onSubmit}
      initialInfo={initialAddMedicationInfo}
    />
  );
}
