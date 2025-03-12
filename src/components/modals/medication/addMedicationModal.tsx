import {
  initialAddMedicationInfo,
  MedicationModalInfo,
} from "./medicationModalInfo";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { useUser } from "@/components/UserContext";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationBaseModal from "./baseModal";
import { useRouter } from "next/navigation";
import parseModalMedication from "@/utils/parseModalMedition";
import { MedicationInfo } from "@/types/medication";

export default function AddMedicationModal() {
  const router = useRouter();
  const { userId } = useUser();

  const onSubmit = async (addMedicationInfo: MedicationModalInfo) => {
    if (!userId) {
      throw new UnauthorizedError(
        "User ID is missing. Please make sure you're logged in.",
      );
    }
    const parsedMedicationInfo = parseModalMedication(
      addMedicationInfo,
    ) as MedicationInfo;
    await MedicationHTTPClient.createMedication(
      userId as string,
      parsedMedicationInfo,
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
