import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useState } from "react";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import { InventoryItem } from "@/types/inventory";
import {
  useEquipPetItem,
  useEquipPetOutfit,
  usePet,
  useUnequipPetItem,
} from "@/components/hooks/usePet";
import Inventory from "@/components/inventory/Inventory";
import { SavedOutfit } from "@/db/models/pet";
import OutfitSaveModal from "@/components/modals/outfit/saveModal";
import OutfitDeleteModal from "@/components/modals/outfit/deleteModal";
import { compareAppearance } from "@/utils/pets";
import { usePetBag } from "@/components/hooks/useInventory";

export default function Bag() {
  const { data: pet } = usePet();
  const { data: petBag } = usePetBag(pet?._id);
  const equipItemMutation = useEquipPetItem();
  const unequipItemMutation = useUnequipPetItem();
  const equipOutfitMutation = useEquipPetOutfit();

  const [selectedItem, setSelectedItem] = useState<
    InventoryItem | SavedOutfit | null
  >(null);
  const [saveCurrentOutfit, setSaveCurrentOutfit] = useState<boolean>(false);
  const [deleteSelectedOutfit, setDeleteSelectedOutfit] =
    useState<boolean>(false);

  const equipItem = async () => {
    if (!pet || !selectedItem || "clothing" in selectedItem) return;

    equipItemMutation.mutate(
      {
        petId: pet._id,
        name: selectedItem.name,
        type: (selectedItem as InventoryItem).type,
      },
      {
        onSuccess: () => {
          console.log("Item successfully equipped");
        },
        onError: (error) => {
          console.error("Error equipping item", error);
        },
      },
    );
  };

  const unequipItem = async () => {
    if (!pet || !selectedItem || "clothing" in selectedItem) return;

    unequipItemMutation.mutate(
      {
        petId: pet._id,
        attribute: (selectedItem as InventoryItem).type,
      },
      {
        onSuccess: () => {
          setSelectedItem(null);
        },
        onError: (error) => {
          console.error("Error unequipping item", error);
        },
      },
    );
  };

  const isitemEquipped = () => {
    if (!pet || !selectedItem || "clothing" in selectedItem) return false;
    if (Object.values(pet.appearance || {}).includes(selectedItem.name))
      return true;
    return false;
  };

  const isOutfitEquipped = () => {
    if (!pet || !selectedItem || "level" in selectedItem) return false;
    if (compareAppearance(pet.appearance, selectedItem as SavedOutfit))
      return true;
    return false;
  };

  const equipOutfit = async () => {
    if (!pet || !selectedItem || "level" in selectedItem) return;

    const newAppearance = {
      ...selectedItem,
      _id: undefined,
      name: undefined,
    };

    equipOutfitMutation.mutate(
      {
        petId: pet._id,
        appearance: newAppearance as Omit<SavedOutfit, "name">,
      },
      {
        onError: (error) => {
          console.error("error equipping outfit", error);
        },
      },
    );
  };

  const isLoading =
    equipItemMutation.isPending ||
    unequipItemMutation.isPending ||
    equipOutfitMutation.isPending;

  return (
    <AuthorizedRoute>
      {pet && petBag ? (
        <Inventory
          outsideClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          topView={
            <div className="ml-[31px] mt-[40px] flex justify-center items-center gap-6">
              {Object.values(
                pet.appearance ? { ...pet.appearance, _id: undefined } : {},
              ).some((value) => value !== undefined) && (
                <div
                  className="bg-icanBlue-300 p-3 px-6 font-quantico text-2xl font-bold cursor-pointer"
                  onClick={() => setSaveCurrentOutfit(true)}
                >
                  Save Current as Outfit
                </div>
              )}
              {selectedItem && "clothing" in selectedItem && (
                <div
                  className="bg-errorRed/95 p-3 px-6 font-quantico text-2xl font-bold cursor-pointer"
                  onClick={() => setDeleteSelectedOutfit(true)}
                >
                  Delete Outfit
                </div>
              )}
            </div>
          }
          overlayScreen={
            saveCurrentOutfit ? (
              <OutfitSaveModal setModal={setSaveCurrentOutfit} />
            ) : (
              deleteSelectedOutfit && (
                <OutfitDeleteModal
                  setModal={setDeleteSelectedOutfit}
                  selectedItem={selectedItem as SavedOutfit}
                  setSelectedItem={setSelectedItem}
                />
              )
            )
          }
          leftPanel={
            <InventoryLeftPanel
              petData={pet}
              selectedItem={selectedItem}
              button={
                selectedItem && "level" in selectedItem ? (
                  <button
                    onClick={isitemEquipped() ? unequipItem : equipItem}
                    disabled={isLoading}
                    className={`font-quantico ${isitemEquipped() ? "bg-icanGreen-200" : "bg-iCAN-Blue-300"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white`}
                    type="button"
                  >
                    {isitemEquipped() ? "Remove" : "Put On"}
                  </button>
                ) : (
                  selectedItem && (
                    <button
                      onClick={isOutfitEquipped() ? undefined : equipOutfit}
                      disabled={isLoading || isOutfitEquipped()}
                      className={`font-quantico ${isOutfitEquipped() ? "bg-icanGreen-200" : "bg-iCAN-Blue-300"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white`}
                      type="button"
                    >
                      {isOutfitEquipped() ? "Equipped" : "Put On"}
                    </button>
                  )
                )
              }
            />
          }
          tabContainer={
            <InventoryTabContainer
              type="Bag"
              petData={pet}
              data={[
                petBag?.clothing || [],
                [petBag?.shoes, petBag?.hat, petBag?.occupation]
                  .filter(Boolean)
                  .flat()
                  .map((i) => i),
                petBag?.background || [],
                pet.outfits,
              ]}
              exclude={[[], [], [], []]}
              onSelectTab={() => setSelectedItem(null)}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          }
        />
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
