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
import { SavedOutfit } from "@/db/models/pet";
import Image from "next/image";

export default function Store() {
  const { pet, setPet } = usePet();
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]> | null>(
    null,
  );
  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    InventoryItem | SavedOutfit | null
  >(null);

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
    if (!pet || !selectedItem || "clothing" in selectedItem) return;

    try {
      await InventoryHTTPClient.purchaseItem({
        petId: pet._id,
        name: selectedItem.name,
        type: (selectedItem as InventoryItem).type,
      });

      setPet((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          coins: prev.coins - (selectedItem as InventoryItem).cost,
        };
      });

      const tempBag = { ...petBag };
      if (tempBag?.[(selectedItem as InventoryItem).type as ItemType]) {
        tempBag[(selectedItem as InventoryItem).type as ItemType].push(
          selectedItem as InventoryItem,
        );
      } else {
        tempBag[(selectedItem as InventoryItem).type as ItemType] = [
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
          topView={
            <div className="flex justify-center ml-[31px] p-2 mt-[40px] font-quantico text-black font-bold text-center text-4xl bg-[#E6E8F9] border-[3px] border-black">
              Balance:
              <Image
                src="/icons/Coin.svg"
                alt="Coins"
                width={38}
                height={38}
                draggable={false}
                className="select-none object-contain"
              />
              <div className="pl-1">{pet.coins}</div>
            </div>
          }
          outsideClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedItem(null);
            }
          }}
          overlayScreen={
            showPurchasedScreen &&
            selectedItem && (
              <PurchaseScreen
                item={selectedItem as InventoryItem}
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
                    disabled={
                      !selectedItem ||
                      pet.coins < (selectedItem as InventoryItem).cost
                    }
                    className={`font-quantico ${selectedItem && pet.coins >= (selectedItem as InventoryItem).cost ? "hover:bg-icanGreen-200" : "!bg-iCAN-error"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                    type="button"
                  >
                    {selectedItem &&
                    pet.coins >= (selectedItem as InventoryItem).cost
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
                ensureValuesArray({
                  ...storeItems.shoes,
                  ...storeItems.hat,
                  ...storeItems.occupation,
                }),
                ensureValuesArray(storeItems.background),
                ensureValuesArray(storeItems.food),
              ]}
              exclude={[
                petBag?.clothing || [],
                [petBag?.shoes, petBag?.hat, petBag?.occupation]
                  .filter(Boolean)
                  .flat()
                  .map((i) => i),
                petBag?.background || [],
                petBag?.food || [],
              ]}
              onSelectTab={() => setSelectedItem(null)}
              selectedItem={selectedItem as InventoryItem}
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
