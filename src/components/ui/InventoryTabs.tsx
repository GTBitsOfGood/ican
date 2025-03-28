import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

interface TabData {
  title: string;
  image: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: TabData[];
  onSelectTab?: () => void;
}

const InventoryTabs: React.FC<TabsProps> = ({ tabs, onSelectTab }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tabs
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        if (onSelectTab) {
          onSelectTab();
        }
      }}
    >
      <TabList className="flex justify-between border-bottom-0">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={`flex-1 text-center py-4 border-x-2 border-t-2 border-white largeDesktop:h-[154px] desktop:h-[130px] tablet:h-[100px] ${
              index === 0
                ? "ml-0 mr-[3vw]"
                : index === tabs.length - 1
                  ? "mr-0 ml-[3vw]"
                  : "mx-[3vw]"
            } ${
              selectedIndex == index
                ? "text-black underline"
                : "bg-icanBlue-300 text-white"
            }`}
            selectedClassName={`bg-[#7D83B2]`}
          >
            <img
              src={tab.image}
              alt={tab.title}
              draggable="false"
              className="mx-auto largeDesktop:w-[67px] desktop:w-[55px] tablet:w-[42px] mb-2"
            />
            <span className="font-quantico largeDesktop:text-[24px] desktop:w-[20px] tablet:text-[16px] font-bold">
              {tab.title}
            </span>
          </Tab>
        ))}
      </TabList>

      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          className="border-x-2 border-white bg-[#7D83B2] flex flex-col"
        >
          <div className="overflow-y-auto largeDesktop:h-[calc(100vh-276px)] desktop:h-[calc(100vh-253px)] tablet:h-[calc(100vh-222px)] flex-1">
            {tab.content}
          </div>
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default InventoryTabs;
