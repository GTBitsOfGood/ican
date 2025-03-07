import React from "react";
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
  return (
    <Tabs>
      <TabList
        style={{
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            className="flex-1 text-center py-4 mx-2 sm:mx-4 md:mx-6 lg:mx-8 xl:mx-10 border border-black bg-icanBlue-300"
          >
            <img src={tab.image} alt={tab.title} className="w-10 h-10 mb-2" />
            {tab.title}
          </Tab>
        ))}
      </TabList>

      {tabs.map((tab, index) => (
        <TabPanel key={index}>{tab.content}</TabPanel>
      ))}
    </Tabs>
  );
};

export default StoreTabs;
