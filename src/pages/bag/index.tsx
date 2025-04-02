import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useEffect, useState } from "react";
import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import { InventoryItem, ItemType } from "@/types/inventory";
import { usePet } from "@/components/petContext";

export default function Bag() {
  const router = useRouter();
  const { pet, setPet } = usePet();
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]>>({});
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const getPetBag = async () => {
      if (!pet) return;
      try {
        const newPetBag = await InventoryHTTPClient.getPetBag(pet._id);
        if (newPetBag) {
          setPetBag(newPetBag);
        } else {
          console.log("No bag");
        }
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    getPetBag();
  }, [pet?._id]);

  const equipItem = async () => {
    if (!pet) return;
    if (!selectedItem) return;

    try {
      await InventoryHTTPClient.equipItem(
        pet._id,
        selectedItem.name,
        selectedItem.type === ItemType.ACCESSORY
          ? (selectedItem.category as string)
          : (selectedItem.type as string),
      );

      setPet((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          appearance: {
            ...prev.appearance,
            [selectedItem.type]: selectedItem.name,
          },
        };
      });

      console.log("Item successfully equiped");
    } catch (error) {
      console.error("Error purchasing item", error);
    }
  };

  const unequipItem = async () => {
    if (!pet) return;
    if (!selectedItem) return;

    try {
      await InventoryHTTPClient.unequipItem(
        pet._id,
        selectedItem.type === ItemType.ACCESSORY
          ? (selectedItem.category as string)
          : (selectedItem.type as string),
      );

      setPet((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          appearance: {
            ...prev.appearance,
            [selectedItem.type]: undefined,
          },
        };
      });
    } catch (error) {
      console.error("Error unequiping item", error);
    }
  };

  const isEquipped = () => {
    if (!pet) return false;
    if (!selectedItem) return false;
    if (
      Object.values(pet.appearance).includes(selectedItem.name) ||
      Object.values(pet.appearance.accessory ?? {}).includes(selectedItem.name)
    )
      return true;
  };

  return (
    <AuthorizedRoute>
      {pet ? (
        <div
          className="flex justify-end relative"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
        >
          <div className="fixed top-0 left-0 w-[26%]">
            <InventoryLeftPanel
              petData={pet}
              selectedItem={selectedItem}
              button={
                selectedItem && (
                  <button
                    onClick={isEquipped() ? unequipItem : equipItem}
                    className={`font-quantico ${isEquipped() ? "bg-icanGreen-200" : "bg-iCAN-Blue-300"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white`}
                    type="button"
                  >
                    {isEquipped() ? "Remove" : "Put On"}
                  </button>
                )
              }
            />
          </div>
          <div className="flex flex-col w-[74%] min-h-screen bg-[#4C539B] pb-7">
            <div className="flex justify-end items-center">
              <div
                className="font-pixelify mt-[30px] pr-[60px] text-icanGreen-100 text-7xl leading-none cursor-pointer"
                onClick={() => router.push("/")}
              >
                x
              </div>
            </div>
            <div className="mt-5 mx-[31px] flex-grow">
              <InventoryTabContainer
                type="Bag"
                petData={pet}
                data={[
                  petBag?.clothing || [],
                  petBag?.accessory || [],
                  petBag?.background || [],
                  petBag?.food || [],
                ]}
                exclude={[[], [], [], []]}
                onSelectTab={() => setSelectedItem(null)}
                selectedItem={selectedItem}
                setSelectedItem={setSelectedItem}
              />
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
