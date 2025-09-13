import { MedicationInfo } from "@/types/medication";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { useUser } from "@/components/UserContext";
import { UnauthorizedError, ValidationError } from "@/types/exceptions";
import MedicationBaseModal from "./baseModal";
import { Medication } from "@/db/models/medication";
import { WithId, WithOptionalId } from "@/types/models";
import { useRouter } from "next/navigation";

interface EditMedicationModalProps {
  initialInfo?: WithId<Medication>;
}

export default function EditMedicationModal({
  initialInfo,
}: EditMedicationModalProps) {
  const router = useRouter();
  const { userId } = useUser();

  if (initialInfo === undefined) {
    router.push("/medications");
    return;
  }

  const onSubmit = async (medicationInfo: WithOptionalId<MedicationInfo>) => {
    if (!userId) {
      throw new UnauthorizedError(
        "User ID is missing. Please make sure you're logged in.",
      );
    }
    const { _id, ...info } = medicationInfo;
    if (_id) {
      await MedicationHTTPClient.updateMedication({
        medicationId: _id,
        medicationInfo: info,
      });
      router.push("/medications");
    } else {
      throw new ValidationError("The Medication ID is missing.");
    }
  };

  return (
    <MedicationBaseModal
      modalType="Edit"
      onSubmit={onSubmit}
      initialInfo={initialInfo}
    />
  );
}
