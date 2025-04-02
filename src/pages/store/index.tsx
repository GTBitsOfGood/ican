import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useEffect, useState } from "react";
import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import PurchaseScreen from "@/components/inventory/purchaseScreen";
import { InventoryItem, ItemType } from "@/types/inventory";
import storeItems from "@/lib/storeItems";
import { ensureValuesArray } from "@/lib/utils";
import { usePet } from "@/components/petContext";
import Inventory from "@/components/inventory/Inventory";

export default function Store() {
  const { pet, setPet } = usePet();
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]> | null>(
    null,
  );
  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
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

  const purchaseItem = async () => {
    if (!selectedItem) return;
    if (!pet) return;

    try {
      await InventoryHTTPClient.purchaseItem({
        petId: pet._id as string,
        name: selectedItem.name as string,
        type:
          selectedItem.type === ItemType.ACCESSORY
            ? (selectedItem.category as string)
            : (selectedItem.type as string),
      });

      setPet((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          coins: prev.coins - selectedItem.cost,
        };
      });

      const tempBag = { ...petBag };
      if (tempBag?.[selectedItem.type as ItemType]) {
        tempBag[selectedItem.type as ItemType].push(
          selectedItem as InventoryItem,
        );
      } else {
        tempBag[selectedItem.type as ItemType] = [
          selectedItem as InventoryItem,
        ];
      }
      setPetBag(tempBag);

      setShowPurchasedScreen(true);
      console.log("Item successfully purchased");
    } catch (error) {
      console.error("Error purchasing item", error);
    }
  };

  return (
    <AuthorizedRoute>
      {pet && petBag ? (
        <Inventory
          balance={pet.coins}
          outsideClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          overlayScreen={
            showPurchasedScreen &&
            selectedItem && (
              <PurchaseScreen
                item={selectedItem}
                setDismiss={() => {
                  setSelectedItem(null);
                  setShowPurchasedScreen(false);
                }}
              />
            )
          }
          leftPanel={
            <InventoryLeftPanel
              petData={pet}
              selectedItem={selectedItem}
              button={
                selectedItem && (
                  <button
                    onClick={purchaseItem}
                    disabled={!selectedItem || pet.coins < selectedItem.cost}
                    className={`font-quantico ${selectedItem && pet.coins >= selectedItem.cost ? "hover:bg-icanGreen-200" : "!bg-iCAN-error"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                    type="button"
                  >
                    {selectedItem && pet.coins >= selectedItem.cost
                      ? "Purchase"
                      : "Insufficient Funds"}
                  </button>
                )
              }
            />
          }
          tabContainer={
            <InventoryTabContainer
              type="Store"
              petData={pet}
              data={[
                ensureValuesArray(storeItems.clothing),
                ensureValuesArray(storeItems.accessory),
                ensureValuesArray(storeItems.background),
                ensureValuesArray(storeItems.food),
              ]}
              exclude={[
                petBag?.clothing || [],
                petBag?.accessory || [],
                petBag?.background || [],
                petBag?.food || [],
              ]}
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
