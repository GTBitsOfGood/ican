import Image from "next/image";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";
import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import PurchaseScreen from "@/components/inventory/purchaseScreen";
import { InventoryItem, ItemType } from "@/types/inventory";
import storeItems from "@/lib/storeItems";
import { ensureValuesArray } from "@/lib/utils";

export default function Bag() {
  const router = useRouter();
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [petBag, setPetBag] = useState<Record<string, InventoryItem[]>>({});
  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const getPetData = async () => {
      if (userId) {
        try {
          const pet = await PetHTTPClient.getPet(userId);
          const newPetBag = await InventoryHTTPClient.getPetBag(pet._id);
          if (pet) {
            setPetData(pet);
          } else {
            console.log("No pet data found for userId:", userId);
          }

          if (newPetBag) {
            setPetBag(newPetBag);
          } else {
            console.log("No bag");
          }
        } catch (error) {
          console.error("Error fetching pet data:", error);
        }
      }
    };

    getPetData();
  }, [userId]);

  const purchaseItem = async () => {
    try {
      await InventoryHTTPClient.purchaseItem({
        petId: petData?._id as string,
        name: selectedItem?.name as string,
        type:
          selectedItem?.type === ItemType.ACCESSORY
            ? (selectedItem?.category as string)
            : (selectedItem?.type as string),
      });

      setPetData({
        ...(petData as Pet),
        coins: (petData?.coins || 0) - (selectedItem?.cost || 0),
      });

      const tempBag = { ...petBag };
      if (tempBag?.[selectedItem?.type as ItemType]) {
        tempBag[selectedItem?.type as ItemType].push(
          selectedItem as InventoryItem,
        );
      } else {
        tempBag[selectedItem?.type as ItemType] = [
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
      {petData ? (
        <div
          className="flex relative"
          onClick={() => {
            if (showPurchasedScreen) {
              setShowPurchasedScreen(false);
              setSelectedItem(null);
            }
          }}
        >
          {showPurchasedScreen && selectedItem && (
            <PurchaseScreen item={selectedItem} />
          )}
          <div className="w-[26%]">
            <InventoryLeftPanel
              petData={petData}
              selectedItem={selectedItem}
              button={
                <button
                  onClick={purchaseItem}
                  disabled={!selectedItem || petData.coins < selectedItem.cost}
                  className={`font-quantico ${selectedItem && petData.coins >= selectedItem.cost ? "hover:bg-icanGreen-200" : ""} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                  type="button"
                >
                  Purchase
                </button>
              }
            />
          </div>
          <div className="w-[74%] h-screen bg-[#4C539B]">
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
                <div className="pl-1">{petData.coins}</div>
              </div>
              <div
                className="font-pixelify mt-[30px] pr-[60px] text-icanGreen-100 text-7xl leading-none cursor-pointer"
                onClick={() => router.push("/")}
              >
                x
              </div>
            </div>
            <div className="mt-5 mx-[31px]">
              <InventoryTabContainer
                type="Store"
                petData={petData}
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
