import { Dispatch, SetStateAction, useState } from "react";
import { Tabs, TabList } from "react-tabs";
import InventoryTab from "./InventoryTab";
import InventoryTabPanel from "./InventoryTabPanel";
import { Pet } from "@/types/pet";
import { InventoryItem } from "@/types/inventory";
import { SavedOutfit } from "@/db/models/pet";

export interface TabsProps {
  type: "Store" | "Bag";
  onSelectTab: () => void;
  petData: Pet;
  data: (InventoryItem[] | SavedOutfit[])[];
  exclude: InventoryItem[][];
  selectedItem: InventoryItem | SavedOutfit | null;
  setSelectedItem: Dispatch<SetStateAction<InventoryItem | SavedOutfit | null>>;
  disabledTabs?: number[];
}

const InventoryTabContainer: React.FC<TabsProps> = ({
  type,
  onSelectTab,
  petData,
  data,
  exclude,
  selectedItem,
  setSelectedItem,
  disabledTabs = [],
}) => {
  const [selectedIndex, setSelectedIndex] = useState(() => {
    if (disabledTabs.includes(0)) {
      for (let i = 0; i < 4; i++) {
        if (!disabledTabs.includes(i)) {
          return i;
        }
      }
    }
    return 0;
  });

  return (
    <Tabs
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        onSelectTab();
      }}
      className="flex flex-col h-full"
    >
      <TabList className="flex gap-16 justify-between border-bottom-0">
        {["Clothes", "Accessories", "Backgrounds"].map((title, index) => (
          <InventoryTab
            key={title}
            title={title}
            image={`/store/categories/${title}.svg`}
            selected={selectedIndex === index}
            disabled={disabledTabs.includes(index)}
          />
        ))}
        {type == "Store" ? (
          <InventoryTab
            title="Food"
            image={"/store/categories/Food.svg"}
            selected={selectedIndex === 3}
            disabled={disabledTabs.includes(3)}
          />
        ) : (
          <InventoryTab
            title="Outfits"
            image={"/store/categories/Outfits.svg"}
            selected={selectedIndex === 3}
            disabled={disabledTabs.includes(3)}
          />
        )}
      </TabList>

      {data.map((inventoryData, index) => (
        <InventoryTabPanel
          key={index}
          type={type}
          inventoryData={inventoryData}
          exclude={exclude[index]}
          petData={petData}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
        />
      ))}
    </Tabs>
  );
};

export default InventoryTabContainer;
