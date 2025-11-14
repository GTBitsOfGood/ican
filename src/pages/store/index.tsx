import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useState } from "react";
import InventoryLeftPanel from "@/components/inventory/InventoryLeftPanel";
import InventoryTabContainer from "@/components/inventory/InventoryTabContainer";
import LoadingScreen from "@/components/loadingScreen";
import PurchaseScreen from "@/components/inventory/purchaseScreen";
import { InventoryItem } from "@/types/inventory";
import storeItems from "@/lib/storeItems";
import { ensureValuesArray } from "@/lib/utils";
import { usePet } from "@/components/hooks/usePet";
import Inventory from "@/components/inventory/Inventory";
import { SavedOutfit } from "@/db/models/pet";
import Image from "next/image";
import { usePetBag, usePurchaseItem } from "@/components/hooks/useInventory";
import { useTutorialStatus } from "@/components/hooks/useAuth";
import { useUser } from "@/components/UserContext";
import { useTutorial } from "@/components/TutorialContext";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";

export default function Store() {
  const { userId } = useUser();
  const { data: tutorialCompleted } = useTutorialStatus(userId);
  const isTutorial = !tutorialCompleted;

  const tutorial = useTutorial();
  const { data: realPet } = usePet();
  const pet = realPet;

  const { data: realBag } = usePetBag(pet?._id);
  const petBag = realBag;

  const realPurchase = usePurchaseItem();
  const purchaseItemMutation = realPurchase;

  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    InventoryItem | SavedOutfit | null
  >(null);

  const purchaseItem = async () => {
    if (!pet || !selectedItem || "clothing" in selectedItem) return;

    const item = selectedItem as InventoryItem;
    const itemData = {
      petId: pet._id,
      name: item.name,
      type: item.type,
      cost: item.cost,
    };

    purchaseItemMutation.mutate(itemData, {
      onSuccess: () => {
        setShowPurchasedScreen(true);
        if (isTutorial && item.type === "food") {
          tutorial.advanceToPortion(TUTORIAL_PORTIONS.LOG_TUTORIAL);
        }
      },
      onError: (error) => {
        console.error("Error purchasing item", error);
      },
    });
  };

  const isPurchasing = purchaseItemMutation.isPending;

  return (
    <AuthorizedRoute>
      {pet && petBag ? (
        <Inventory
          topView={
            <div className="flex justify-center items-center ml-[31px] p-2 mt-[40px] font-quantico text-black font-bold text-center text-2xl tablet:text-3xl desktop:text-4xl bg-[#E6E8F9] border-[3px] border-black">
              Balance:
              <Image
                src="/icons/Coin.svg"
                alt="Coins"
                width={0}
                height={0}
                sizes="100vw"
                draggable={false}
                className="ml-2 w-6 h-6 desktop:w-[38px] desktop:h-[38px] select-none object-contain"
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
                      isPurchasing ||
                      !selectedItem ||
                      pet.coins < (selectedItem as InventoryItem).cost
                    }
                    className={`font-quantico ${selectedItem && pet.coins >= (selectedItem as InventoryItem).cost ? "hover:bg-icanGreen-200" : "!bg-iCAN-error"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                    type="button"
                  >
                    {isPurchasing
                      ? "Purchasing..."
                      : selectedItem &&
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
              disabledTabs={isTutorial ? [0, 1, 2] : []}
            />
          }
        />
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
