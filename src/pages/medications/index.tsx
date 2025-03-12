import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import AddMedicationButton from "@/components/ui/AddMedicationButton";
// import { useState } from "react";
// import { AddMedicationInfo } from "@/components/modals/addMedication/addMedicationInfo";

export default function MedicationsPage() {
  // const [medications, setMedications] = useState<AddMedicationInfo[]>([]);

  return (
    <AuthorizedRoute>
      <div className="min-h-screen max-h-screen flex flex-col items-center gap-4 relative px-2 pt-4 pb-8 bg-icanBlue-200">
        <div className="flex w-full justify-between items-center">
          <BackButton link="/settings" />
        </div>
        <div className="flex flex-col w-[95%] h-full gap-4">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <AddMedicationButton />
          </div>
          <div className="flex flex-col overflow-y-auto gap-12 medications-scrollbar">
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
            <h1 className="font-quantico text-6xl font-bold text-white">
              Medications
            </h1>
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}
