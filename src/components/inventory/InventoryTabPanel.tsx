import { InventoryItem } from "@/types/inventory";
import Item from "./Item";
import LockedItem from "./LockedItem";
import {
  ReactTabsFunctionComponent,
  TabPanel,
  TabPanelProps,
} from "react-tabs";
import React, { Dispatch, SetStateAction } from "react";
import { Pet } from "@/types/pet";
import { SavedOutfit } from "@/db/models/pet";
import Outfit from "./outfit";
import { compareAppearance } from "@/utils/pets";

interface StoreTabContentProps extends TabPanelProps {
  type: "Store" | "Bag";
  inventoryData: InventoryItem[] | SavedOutfit[];
  exclude: InventoryItem[];
  petData: Pet;
  selectedItem: InventoryItem | SavedOutfit | null;
  setSelectedItem: Dispatch<SetStateAction<InventoryItem | SavedOutfit | null>>;
}

const InventoryTabPanel: ReactTabsFunctionComponent<StoreTabContentProps> = ({
  type,
  inventoryData,
  exclude,
  petData,
  selectedItem,
  setSelectedItem,
  ...props
}) => {
  const items = inventoryData.filter(
    (item) => !exclude.map((i) => i.name).includes(item.name),
  );
  const sortedItems = [...items].sort((a, b) => {
    if (!("level" in a) || !("level" in b)) {
      return 0;
    }

    const aIsStreakLocked =
      a.isStreakLocked && petData.currentStreak < (a.streakRequirement || 3);
    const bIsStreakLocked =
      b.isStreakLocked && petData.currentStreak < (b.streakRequirement || 3);

    if (aIsStreakLocked !== bIsStreakLocked) {
      return aIsStreakLocked ? 1 : -1;
    }

    if (a.level !== b.level) {
      return a.level - b.level;
    }

    return a.displayName.localeCompare(b.displayName);
  });

  return (
    <TabPanel
      {...props}
      className={`-mt-[2px] hidden min-h-[420px] flex-grow overflow-y-auto border-2 border-white bg-[#7D83B2] desktop:min-h-[520px]`}
      selectedClassName={`!block`}
    >
      <div className="grid grid-cols-2 gap-3 p-3 tablet:grid-cols-3 desktop:grid-cols-4 desktop:gap-4 desktop:p-4">
        {sortedItems.map((item, index) =>
          "level" in item ? (
            type === "Store" ? (
              petData.xpLevel >= item.level &&
              (!item.isStreakLocked ||
                petData.currentStreak >= (item.streakRequirement || 3)) ? (
                <Item
                  key={index}
                  type={type}
                  item={item}
                  isSelected={item.name === selectedItem?.name}
                  isWearing={Object.values(petData.appearance || {}).includes(
                    item.name,
                  )}
                  setSelectedItem={setSelectedItem}
                />
              ) : (
                <LockedItem
                  key={index}
                  item={item}
                  currentStreak={petData.currentStreak}
                />
              )
            ) : (
              <Item
                key={index}
                type={type}
                item={item}
                isSelected={item.name === selectedItem?.name}
                isWearing={Object.values(petData.appearance || {}).includes(
                  item.name,
                )}
                setSelectedItem={setSelectedItem}
              />
            )
          ) : (
            <Outfit
              key={index}
              item={item as SavedOutfit}
              isSelected={item.name === selectedItem?.name}
              isWearing={compareAppearance(petData.appearance, item)}
              setSelectedItem={setSelectedItem}
            />
          ),
        )}
      </div>
    </TabPanel>
  );
};

InventoryTabPanel.tabsRole = "TabPanel";
export default InventoryTabPanel;
