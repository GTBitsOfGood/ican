import { Dispatch, SetStateAction } from "react";
import { InventoryItem } from "@/types/inventory";
import Item from "./Item";
import LockedItem from "./LockedItem";
import {
  ReactTabsFunctionComponent,
  TabPanel,
  TabPanelProps,
} from "react-tabs";

interface StoreTabContentProps extends TabPanelProps {
  type: "Store" | "Bag";
  inventoryData: InventoryItem[];
  exclude: InventoryItem[];
  petLevel: number;
  selectedItem: InventoryItem | null;
  setSelectedItem: Dispatch<SetStateAction<InventoryItem | null>>;
}

const InventoryTabPanel: ReactTabsFunctionComponent<StoreTabContentProps> = ({
  type,
  inventoryData,
  exclude,
  petLevel,
  selectedItem,
  setSelectedItem,
  ...tabPanelProps
}) => {
  const items = inventoryData.filter(
    (item) => !exclude.map((i) => i.name).includes(item.name),
  );

  const handleItemClick = (item: InventoryItem): void => {
    setSelectedItem(item);
  };

  return (
    <TabPanel
      className="border-x-2 border-white bg-[#7D83B2] flex flex-col"
      {...tabPanelProps}
    >
      <div className="overflow-y-auto largeDesktop:h-[calc(100vh-276px)] desktop:h-[calc(100vh-253px)] tablet:h-[calc(100vh-222px)] flex-1">
        <div className="grid grid-cols-4 gap-4 p-4">
          {items.map((item, index) =>
            type === "Store" ? (
              petLevel >= item.level ? (
                <Item
                  key={index}
                  item={item}
                  isSelected={item.name === selectedItem?.name}
                  onClick={() => handleItemClick(item)}
                />
              ) : (
                <LockedItem key={index} item={item} />
              )
            ) : (
              <Item
                key={index}
                item={item}
                isSelected={item.name === selectedItem?.name}
                onClick={() => handleItemClick(item)}
              />
            ),
          )}
        </div>
      </div>
    </TabPanel>
  );
};

InventoryTabPanel.tabsRole = "TabPanel";
export default InventoryTabPanel;
