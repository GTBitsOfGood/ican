import { usePet } from "@/components/petContext";
import { SavedOutfit } from "@/db/models/pet";
import { Dispatch, SetStateAction, useState } from "react";
import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import ModalButton from "@/components/ui/modals/modalButton";
import PetHTTPClient from "@/http/petHTTPClient";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";

interface OutfitDeleteModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
  selectedItem: SavedOutfit;
  setSelectedItem: Dispatch<SetStateAction<SavedOutfit | null>>;
}

export default function OutfitDeleteModal({
  setModal,
  selectedItem,
  setSelectedItem,
}: OutfitDeleteModalProps) {
  const { data: pet } = usePet();
  const queryClient = useQueryClient();
  const { userId } = useUser();
  const [error, setError] = useState<string>("");

  const deleteOutfit = async () => {
    if (!pet) return;
    setError("");

    try {
      await PetHTTPClient.deleteOutfit(pet._id, selectedItem.name);

      queryClient.invalidateQueries({ queryKey: ["pet", userId] });

      setSelectedItem(null);
      setModal(false);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <ModalBackground>
      <ModalContainer
        className={`flex flex-col w-[600px] ${error ? "h-[250px]" : "h-[200px]"} bg-icanBlue-200 p-10`}
        title={`Delete ${selectedItem.name} Outfit?`}
      >
        <div className="flex flex-col h-full mx-auto w-3/4">
          {error && (
            <div className="mt-4 h-10 tablet:h-12 w-full px-3 tablet:px-4 bg-iCAN-error/90 flex justify-start items-center text-lg tablet:text-xl">
              {error}
            </div>
          )}
          <div
            className={`${error ? "mt-4" : "mt-8"} flex justify-between items-center`}
          >
            <ModalButton type="blue" action={() => setModal(false)}>
              Cancel
            </ModalButton>
            <ModalButton type="danger" action={deleteOutfit}>
              Delete
            </ModalButton>
          </div>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
}
