import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import AddMedicationButton from "@/components/ui/AddMedicationButton";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import AddMedicationModal from "@/components/modals/medication/addMedicationModal";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import EditMedicationModal from "@/components/modals/medication/editMedicationModal";
import MedicationCard from "@/components/ui/MedicationCard";
import DeleteMedicationModal from "@/components/modals/DeleteMedicationModal";
import {
  useDeleteMedication,
  useUserMedications,
} from "@/components/hooks/useMedication";
import { useUser } from "@/components/UserContext";
import { useOnboardingStatus } from "@/components/hooks/useAuth";
import { OnboardingStep } from "@/types/onboarding";
import ModalButton from "@/components/ui/modals/modalButton";

interface MedicationPageProps {
  activeModal: string;
  editMedicationInfo?: WithId<Medication>;
}

export default function MedicationsPage({
  activeModal = "",
  editMedicationInfo = undefined,
}: MedicationPageProps) {
  const router = useRouter();
  const { data: medications = [] } = useUserMedications();
  const deleteMedicationMutation = useDeleteMedication();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [clickedIndex, setClickedIndex] = useState<number>();
  const { userId } = useUser();
  const { data: isOnboarded = true } = useOnboardingStatus(userId);
  const medicationIds = new Set(
    medications.map((med) => med.customMedicationId),
  );

  const handleBackClick = () => {
    if (!isOnboarded) {
      const userType = router.query.userType || "parent";
      router.push(
        `/onboarding/?step=${OnboardingStep.ChoosePet}&userType=${userType}`,
      );
    } else {
      router.push("/settings");
    }
  };

  const handleMedicationDelete = async (index: number) => {
    const medicationId = medications[index]._id;

    deleteMedicationMutation.mutate(medicationId, {
      onSuccess: () => {
        setDeleteModalVisible(false);
        setClickedIndex(undefined);
      },
      onError: (error) => {
        console.error("Error deleting medications:", error);
      },
    });
  };

  return (
    <AuthorizedRoute>
      <div className="min-h-screen max-h-screen flex flex-col items-center gap-4 relative px-2 pt-4 pb-8 bg-icanBlue-200">
        {activeModal === "add-new-medication" && (
          <AddMedicationModal medicationIds={medicationIds} />
        )}
        {activeModal === "edit-medication" && (
          <EditMedicationModal
            initialInfo={editMedicationInfo}
            medicationIds={medicationIds}
          />
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
          {isOnboarded ? (
            <div className="w-16 h-16 [&>a]:w-16 [&>a]:h-16 [&>a>button]:w-full [&>a>button]:h-full">
              <BackButton onClick={handleBackClick} />
            </div>
          ) : (
            <div className="flex w-full justify-end p-5">
              <ModalButton
                className="max-w-max font-quantico"
                action={handleBackClick}
                type="success"
              >
                Next
              </ModalButton>
            </div>
          )}
        </div>
        <div className="flex flex-col w-[95%] h-full gap-4">
          <div className="flex w-full justify-between items-center">
            {isOnboarded ? (
              <h1 className="font-quantico font-bold text-white underline text-5xl desktop:text-6xl">
                Medications
              </h1>
            ) : (
              <div>
                <h1 className="font-quantico font-bold text-white text-5xl desktop:text-6xl">
                  Enter Medications
                </h1>
                <h2 className="font-quantico font-bold text-white text-3xl desktop:text-4xl mt-5">
                  Click to add Medications to your list.
                </h2>
              </div>
            )}
            {medications.length !== 0 && <AddMedicationButton />}
          </div>
          <div className="grid mobile:grid-cols-1 tablet:grid-cols-3 largeDesktop:grid-cols-4 overflow-y-auto tiny:max-h-[40vh] minimized:max-h-[60vh] max-h-[71vh] gap-12 list-scrollbar">
            {medications.length === 0 ? (
              <Link
                href="/medications/add"
                className="mobile:w-full mobile:mx-auto desktop:col-span-1 tablet:col-span-1 largeDesktop:col-span-1 bg-icanBlue-200 text-white flex flex-col justify-center items-center cursor-pointer relative border-2 border-white shadow-medicationCardShadow mobile:!min-h-[200px] desktop:!min-h-[400px]"
              >
                <h2 className="font-quantico mobile:text-xl tablet:text-2xl desktop:text-3xl largeDesktop:text-4xl font-bold underline text-center text-white">
                  + ADD NEW
                </h2>
              </Link>
            ) : (
              medications.map((medication, index) => {
                return (
                  <MedicationCard
                    key={index}
                    index={index}
                    medication={medication}
                    setDeleteModalVisible={setDeleteModalVisible}
                    setClickedIndex={setClickedIndex}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}
