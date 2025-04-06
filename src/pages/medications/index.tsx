import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import AddMedicationButton from "@/components/ui/AddMedicationButton";
import { useState, useEffect } from "react";
import AddMedicationModal, {
  initialAddMedicationInfo,
} from "@/components/modals/medication/addMedicationModal";
import MedicationCard from "@/components/ui/MedicationCard";
import DeleteMedicationModal from "@/components/modals/DeleteMedicationModal";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import EditMedicationModal from "@/components/modals/medication/editMedicationModal";
import MedicationCard from "@/components/ui/MedicationCard";
import DeleteMedicationModal from "@/components/modals/DeleteMedicationModal";
import { Medication } from "@/db/models/medication";
import { useUser } from "@/components/UserContext";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { WithId } from "@/types/models";

interface MedicationPageProps {
  activeModal: string;
  editMedicationInfo?: WithId<Medication>;
}

export default function MedicationsPage({
  activeModal = "",
  editMedicationInfo = undefined,
}: MedicationPageProps) {
  const { userId } = useUser();
  const [medications, setMedications] = useState<WithId<Medication>[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [clickedIndex, setClickedIndex] = useState<number>();

  useEffect(() => {
    const fetchMedications = async () => {
      if (!userId) {
        return;
      }

      try {
        const medicationsData =
          await MedicationHTTPClient.getAllUserMedications(userId);
        setMedications(medicationsData);
      } catch (error) {
        console.error("Error fetching medications:", error);
      }
    };

    fetchMedications();
  }, [userId]);

  const handleMedicationDelete = async (index: number) => {
    try {
      await MedicationHTTPClient.deleteMedication(medications[index]._id);
      setMedications((prev) => {
        const newMedications = [...prev];
        newMedications.splice(index, 1);
        return newMedications;
      });
      setDeleteModalVisible(false);
      setClickedIndex(undefined);
    } catch (error) {
      console.error("Error deleting medications:", error);
    }
  };

  return (
    <AuthorizedRoute>
      <div className="min-h-screen max-h-screen flex flex-col items-center gap-4 relative px-2 pt-4 pb-8 bg-icanBlue-200">
        {activeModal === "add-new-medication" && <AddMedicationModal />}
        {activeModal === "edit-medication" && (
          <EditMedicationModal initialInfo={editMedicationInfo} />
        )}
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
            <h1 className="font-quantico mobile:text-5xl desktop:text-6xl font-bold text-white underline">
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
