import Image from "next/image";
import { useRouter } from "next/router";
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

export default function Store() {
  const router = useRouter();
  const { pet, setPet } = usePet();
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]>>({});
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
  }, [pet?._id]);

  useEffect(() => {
    console.log("Store selectedItem updated:", selectedItem);
  }, [selectedItem]);

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
      {pet ? (
        <div
          className="flex justify-end relative"
          onClick={() => {
            setShowPurchasedScreen(false);
            setSelectedItem(null);
          }}
        >
          {showPurchasedScreen && selectedItem && (
            <PurchaseScreen item={selectedItem} />
          )}
          <div className="fixed top-0 left-0 w-[26%]">
            <InventoryLeftPanel
              petData={pet}
              selectedItem={selectedItem}
              button={
                selectedItem && (
                  <button
                    onClick={purchaseItem}
                    disabled={!selectedItem || pet.coins < selectedItem.cost}
                    className={`font-quantico ${selectedItem && pet.coins >= selectedItem.cost ? "hover:bg-icanGreen-200" : ""} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                    type="button"
                  >
                    Purchase
                  </button>
                )
              }
            />
          </div>
          <div className="flex flex-col w-[74%] min-h-screen bg-[#4C539B] pb-7">
            <div className="flex justify-between items-center">
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
              <div
                className="font-pixelify mt-[30px] pr-[60px] text-icanGreen-100 text-7xl leading-none cursor-pointer"
                onClick={() => router.push("/")}
              >
                x
              </div>
            </div>
            <div className="mt-5 mx-[31px] flex-grow">
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
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
