import { InventoryItem } from "@/types/inventory";
import Item from "./Item";
import LockedItem from "./LockedItem";
import {
  ReactTabsFunctionComponent,
  TabPanel,
  TabPanelProps,
} from "react-tabs";
import { Dispatch, SetStateAction } from "react";
import { Pet } from "@/types/pet";
import { SavedOutfit } from "@/db/models/pet";
import Outfit from "./outfit";

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

  return (
    <TabPanel
      {...props}
      className={`-mt-[2px] hidden border-2 border-white bg-[#7D83B2] flex-grow overflow-y-auto`}
      selectedClassName={`!block`}
    >
      <div className="p-4 grid grid-cols-4 gap-4">
        {items.map((item, index) =>
          "level" in item ? (
            type === "Store" ? (
              petData.xpLevel >= item.level ? (
                <Item
                  key={index}
                  type={type}
                  item={item}
                  isSelected={item.name === selectedItem?.name}
                  isWearing={Object.values(petData.appearance).includes(
                    item.name,
                  )}
                  setSelectedItem={setSelectedItem}
                />
              ) : (
                <LockedItem key={index} item={item} />
              )
            ) : (
              <Item
                key={index}
                type={type}
                item={item}
                isSelected={item.name === selectedItem?.name}
                isWearing={Object.values(petData.appearance).includes(
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
              isWearing={
                JSON.stringify({ ...item, name: undefined, _id: undefined }) ==
                JSON.stringify({ ...petData.appearance, _id: undefined })
              }
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
