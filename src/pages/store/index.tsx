import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useEffect, useState } from "react";
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
import { useTutorial } from "@/components/TutorialContext";

export default function Store() {
  const tutorial = useTutorial();
  const isTutorial = tutorial.isActive;
  const isReplay = tutorial.isReplay;

  const { data: realPet } = usePet();
  const pet = realPet;
  const effectivePet =
    pet && isTutorial
      ? {
          ...pet,
          xpLevel: Math.max(pet.xpLevel ?? 0, 1),
          coins: isReplay ? (tutorial.replayCoins ?? 100) : pet.coins,
        }
      : pet;

  const { data: realBag } = usePetBag(pet?._id);
  const petBag = realBag;

  const realPurchase = usePurchaseItem();
  const purchaseItemMutation = realPurchase;

  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    InventoryItem | SavedOutfit | null
  >(null);

  useEffect(() => {
    if (!showPurchasedScreen) return;

    const timeoutId = setTimeout(() => {
      setShowPurchasedScreen(false);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [showPurchasedScreen]);

  const purchaseItem = async () => {
    if (!pet || !selectedItem || "clothing" in selectedItem) return;

    const item = selectedItem as InventoryItem;

    if (isReplay) {
      tutorial.purchaseReplayFood(item.displayName, item.cost);
      setShowPurchasedScreen(true);
      tutorial.markFoodPurchased();
      return;
    }

    const itemData = {
      petId: pet._id,
      name: item.name,
      type: item.type,
      cost: item.cost,
    };

    purchaseItemMutation.mutate(itemData, {
      onSuccess: () => {
        setShowPurchasedScreen(true);
        tutorial.markFoodPurchased();
      },
      onError: (error) => {
        console.error("Error purchasing item", error);
      },
    });
  };

  const isPurchasing = purchaseItemMutation.isPending;

  return (
    <AuthorizedRoute>
      {effectivePet && petBag ? (
        <Inventory
          topView={
            <div className="flex items-center justify-center border-[3px] border-black bg-[#E6E8F9] p-2 font-quantico text-center text-2xl font-bold text-black tablet:text-3xl desktop:text-4xl">
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
              <div className="pl-1">{effectivePet.coins}</div>
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
              petData={effectivePet}
              selectedItem={selectedItem}
              button={
                selectedItem && (
                  <button
                    onClick={purchaseItem}
                    disabled={
                      isPurchasing ||
                      !selectedItem ||
                      effectivePet.coins < (selectedItem as InventoryItem).cost
                    }
                    className={`font-quantico ${selectedItem && effectivePet.coins >= (selectedItem as InventoryItem).cost ? "hover:bg-icanGreen-200" : "!bg-iCAN-error"} px-6 py-6 mb-4 desktop:text-4xl tablet:text-3xl font-bold text-white bg-icanBlue-300`}
                    type="button"
                  >
                    {isPurchasing
                      ? "Purchasing..."
                      : selectedItem &&
                          effectivePet.coins >=
                            (selectedItem as InventoryItem).cost
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
              petData={effectivePet}
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
                isReplay
                  ? ensureValuesArray(storeItems.food).filter((item) =>
                      tutorial.replayFoods.includes(item.displayName),
                    )
                  : petBag?.food || [],
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
