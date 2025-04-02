import { Dispatch, SetStateAction, useState } from "react";
import { Tabs, TabList } from "react-tabs";
import InventoryTab from "./InventoryTab";
import InventoryTabPanel from "./InventoryTabPanel";
import { Pet } from "@/types/pet";
import { InventoryItem } from "@/types/inventory";

interface TabsProps {
  type: "Store" | "Bag";
  onSelectTab: () => void;
  petData: Pet;
  data: InventoryItem[][];
  exclude: InventoryItem[][];
  selectedItem: InventoryItem | null;
  setSelectedItem: Dispatch<SetStateAction<InventoryItem | null>>;
}

const InventoryTabContainer: React.FC<TabsProps> = ({
  type,
  onSelectTab,
  petData,
  data,
  exclude,
  selectedItem,
  setSelectedItem,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        {["Clothes", "Accessories", "Backgrounds", "Food"].map(
          (title, index) => (
            <InventoryTab
              key={title}
              title={title}
              image={`/store/categories/${title}.svg`}
              selected={selectedIndex === index}
            />
          ),
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
