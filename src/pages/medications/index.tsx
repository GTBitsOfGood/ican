import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import AddMedicationButton from "@/components/ui/AddMedicationButton";
import { useState, useEffect } from "react";
import { initialAddMedicationInfo } from "@/components/modals/medication/addMedicationModal";
import MedicationCard from "@/components/ui/MedicationCard";
import DeleteMedicationModal from "@/components/modals/DeleteMedicationModal";
import { Medication } from "@/db/models/medication";

export default function MedicationsPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [clickedIndex, setClickedIndex] = useState<number>();

  useEffect(() => {
    // For now mock medication data, put fetch in here later
    setMedications(Array(15).fill(initialAddMedicationInfo));
  }, []);

  const handleMedicationDelete = (index: number) => {
    // Add delete in database
    setDeleteModalVisible(true);
    setMedications((prev) => {
      const newMedications = [...prev];
      newMedications.splice(index, 1);
      return newMedications;
    });
  };

  return (
    <AuthorizedRoute>
      <div className="min-h-screen max-h-screen flex flex-col items-center gap-4 relative px-2 pt-4 pb-8 bg-icanBlue-200">
        {deleteModalVisible &&
          clickedIndex !== undefined &&
          clickedIndex !== null && (
            <DeleteMedicationModal
              medication={medications[clickedIndex]}
              setDeleteModalVisible={setDeleteModalVisible}
              handleDelete={() => handleMedicationDelete(clickedIndex)}
            />
          )}
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
          <div className="grid mobile:grid-cols-2 tablet:grid-cols-3 largeDesktop:grid-cols-4 overflow-y-auto tiny:max-h-[40vh] minimized:max-h-[60vh] max-h-[71vh] gap-12 list-scrollbar">
            {medications.map((medication, index) => {
              return (
                <MedicationCard
                  key={index}
                  index={index}
                  medication={medication}
                  setDeleteModalVisible={setDeleteModalVisible}
                  setClickedIndex={setClickedIndex}
                />
              );
            })}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}
