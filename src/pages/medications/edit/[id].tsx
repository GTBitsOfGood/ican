import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/loadingScreen";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import MedicationsPage from "..";

export default function EditMedication() {
  const router = useRouter();
  const { id: medicationId } = router.query;
  const [medicationInfo, setMedicationInfo] = useState<WithId<Medication>>();

  useEffect(() => {
    if (!router.isReady || typeof medicationId !== "string") {
      return;
    }

    const fetchMedication = async () => {
      try {
        const info = await MedicationHTTPClient.getMedication(medicationId);
        setMedicationInfo(info);
      } catch (error) {
        console.error("Failed to fetch medication:", error);
        router.push("/");
      }
    };

    fetchMedication();
  }, [router, medicationId]);

  if (medicationInfo) {
    return (
      <MedicationsPage
        activeModal="edit-medication"
        editMedicationInfo={medicationInfo}
      />
    );
  } else {
    return <LoadingScreen />;
  }
}
