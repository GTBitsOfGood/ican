import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import AddMedicationButton from "@/components/ui/AddMedicationButton";
import { useState, useEffect } from "react";
import {
  AddMedicationInfo,
  initialAddMedicationInfo,
} from "@/components/modals/addMedication/addMedicationInfo";
import MedicationCard from "@/components/ui/MedicationCard";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<AddMedicationInfo[]>([]);

  useEffect(() => {
    // For now mock medication data, put fetch in here later
    setMedications(Array(6).fill(initialAddMedicationInfo));
  }, []);

  const handleMedicationDelete = (index: number) => {
    console.log("DELETE CALLED");
    setMedications((prev) => {
      const newMedications = [...prev];
      newMedications.splice(index, 1);
      return newMedications;
    });
  };

  useEffect(() => {
    console.log("MEDICATIONS", medications);
  }, [medications]);

  return (
    <AuthorizedRoute>
      <div className="min-h-screen max-h-screen flex flex-col items-center gap-4 relative px-2 pt-4 pb-8 bg-icanBlue-200">
        <div className="flex w-full justify-between items-center">
          <BackButton link="/settings" />
        </div>
        <div className="flex flex-col w-[95%] h-full gap-4">
          <div className="flex w-full justify-between items-center">
            <h1 className="font-quantico mobile:text-5xl desktop:text-6xl font-bold text-white">
              Medications
            </h1>
            <AddMedicationButton />
          </div>
          <div className="grid mobile:grid-cols-2 tablet:grid-cols-3 largeDesktop:grid-cols-4 overflow-y-auto gap-12 medications-scrollbar">
            {medications.map((medication, index) => {
              return (
                <MedicationCard
                  key={index}
                  medication={medication}
                  handleDelete={() => handleMedicationDelete(index)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}
