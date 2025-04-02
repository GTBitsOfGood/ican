import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useEffect, useState } from "react";
import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import { InventoryItem, ItemType } from "@/types/inventory";
import { usePet } from "@/components/petContext";
import Inventory from "@/components/inventory/Inventory";

export default function Bag() {
  const { pet, setPet } = usePet();
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]> | null>(
    null,
  );
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
  }, [pet]);

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
        if (Object.values(ItemType).includes(selectedItem.type)) {
          return {
            ...prev,
            appearance: {
              ...prev.appearance,
              [selectedItem.type]: selectedItem.name,
            },
          };
        } else {
          return {
            ...prev,
            appearance: {
              ...prev.appearance,
              accessory: {
                ...prev.appearance.accessory,
                [selectedItem.category as string]: selectedItem.name,
              },
            },
          };
        }
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
        if (Object.values(ItemType).includes(selectedItem.type)) {
          return {
            ...prev,
            appearance: {
              ...prev.appearance,
              [selectedItem.type]: undefined,
            },
          };
        } else {
          return {
            ...prev,
            appearance: {
              ...prev.appearance,
              accessory: {
                ...prev.appearance.accessory,
                [selectedItem.category as string]: undefined,
              },
            },
          };
        }
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
      {pet && petBag ? (
        <Inventory
          outsideClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          leftPanel={
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
          }
          tabContainer={
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
          }
        />
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
