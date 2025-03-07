import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

interface TabData {
  title: string;
  image: string;
  content: React.ReactNode;
}

interface DynamicTabsProps {
  tabs: TabData[];
}

const StoreTabs: React.FC<DynamicTabsProps> = ({ tabs }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tabs selectedIndex={selectedIndex} onSelect={setSelectedIndex}>
      <TabList className="flex justify-between border-bottom-0">
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className={`flex-1 text-center py-4 border-x-2 bg-icanBlue-300 border-t-2 border-white h-[154px] ${
              index === 0
                ? "ml-0 mr-[3vw]"
                : index === tabs.length - 1
                  ? "mr-0 ml-[3vw]"
                  : "mx-[3vw]"
            }`}
            selectedClassName={`flex-1 text-center py-4 bg-[#7D83B2] border-x-2 border-t-2 border-white h-[154px] text-black underline ${
              index === 0
                ? "ml-0 mr-[3vw]"
                : index === tabs.length - 1
                  ? "mr-0"
                  : "mx-[3vw]"
            }`}
          >
            <img src={tab.image} className="mx-auto w-10 h-10 mb-2" />
            <span className="font-quantico text-[24px] font-bold">
              {tab.title}
            </span>
          </Tab>
        ))}
      </TabList>

      {tabs.map((tab, index) => (
        <TabPanel key={index} className="border-x-2 border-white bg-[#7D83B2]">
          {tab.content}
        </TabPanel>
      ))}
    </Tabs>
  );
};

export default StoreTabs;
