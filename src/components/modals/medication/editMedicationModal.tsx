import { MedicationModalInfo } from "./medicationModalInfo";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { useUser } from "@/components/UserContext";
import { UnauthorizedError } from "@/types/exceptions";
import MedicationBaseModal from "./baseModal";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import { useRouter } from "next/navigation";
import parseModelMedication from "@/utils/parseModelMedication";
import parseModalMedication from "@/utils/parseModalMedition";
import { MedicationInfo } from "@/types/medication";

interface EditMedicationModalProps {
  initialInfo?: WithId<Medication>;
}

export default function EditMedicationModal({
  initialInfo,
}: EditMedicationModalProps) {
  const router = useRouter();
  const { userId } = useUser();

  if (initialInfo === undefined) {
    router.push("/");
    return;
  }

  const onSubmit = async (medicationInfo: MedicationModalInfo) => {
    if (!userId) {
      throw new UnauthorizedError(
        "User ID is missing. Please make sure you're logged in.",
      );
    }
    const { _id, ...parsedMedicationInfo } = parseModalMedication(
      medicationInfo,
    ) as WithId<MedicationInfo>;
    await MedicationHTTPClient.updateMedication(_id, parsedMedicationInfo);
    router.push("/");
  };

  return (
    <MedicationBaseModal
      modalType="Edit"
      onSubmit={onSubmit}
      initialInfo={parseModelMedication(initialInfo)}
    />
  );
}
