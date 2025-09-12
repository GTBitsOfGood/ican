import { useRouter } from "next/router";
import LoadingScreen from "@/components/loadingScreen";
import MedicationsPage from "..";
import { useMedication } from "@/components/hooks/useMedication";

export default function EditMedication() {
  const router = useRouter();
  const { id: medicationId } = router.query;
  const {
    data: medicationInfo,
    isLoading,
    isError,
  } = useMedication(
    router.isReady && typeof medicationId === "string"
      ? medicationId
      : undefined,
  );

  if (isError) {
    console.error("Failed to fetch medication");
    router.push("/");
    return <LoadingScreen />;
  }

  if (isLoading || !medicationInfo) {
    return <LoadingScreen />;
  }

  if (medicationInfo) {
    return (
      <MedicationsPage
        activeModal="edit-medication"
        editMedicationInfo={medicationInfo}
      />
    );
  }
}
