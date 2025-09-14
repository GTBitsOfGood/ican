import { Dispatch, SetStateAction, useState } from "react";
import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import InputBox from "@/components/ui/form/inputBox";
import ModalButton from "@/components/ui/modals/modalButton";
import { usePet, useSavePetOutfit } from "@/components/hooks/usePet";

interface OutfitSaveModalProps {
  setModal: Dispatch<SetStateAction<boolean>>;
}

export default function OutfitSaveModal({ setModal }: OutfitSaveModalProps) {
  const { data: pet } = usePet();
  const savePetOutfitMutation = useSavePetOutfit();
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const saveOutfit = async () => {
    if (!pet) return;
    setError("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    const appearance = { ...pet.appearance, _id: undefined };

    // TODO Add more duplicate checks here in the future for name (and appearence)

    savePetOutfitMutation.mutate(
      {
        petId: pet._id,
        name: name.trim(),
        appearance,
      },
      {
        onSuccess: () => {
          setModal(false);
        },
        onError: (error) => {
          setError((error as Error).message);
        },
      },
    );
  };

  return (
    <ModalBackground>
      <ModalContainer
        className="flex flex-col w-[600px] h-[350px] bg-icanBlue-200 p-10"
        title="Name Your Outfit"
      >
        <div className="flex flex-col h-full mx-auto w-3/4">
          {error && (
            <div className="mt-4 h-10 tablet:h-12 w-full px-3 tablet:px-4 bg-iCAN-error/90 flex justify-start items-center text-lg tablet:text-xl">
              {error}
            </div>
          )}
          <div className={`flex-grow ${error ? "mt-4 mb-4" : "mt-8 mb-8"}`}>
            <InputBox
              maxLength={50}
              value={name}
              onChange={(newValue: string) => setName(newValue)}
              placeHolder="My favorite outfit"
              className="mx-auto w-full p-3 tablet:p-6 text-lg tablet:text-2xl !text-center !font-normal !normal-case"
            />
          </div>
          <div className="flex justify-between items-center">
            <ModalButton type="blue" action={() => setModal(false)}>
              Cancel
            </ModalButton>
            <ModalButton type="success" action={saveOutfit}>
              Save
            </ModalButton>
          </div>
        </div>
      </ModalContainer>
    </ModalBackground>
  );
}
