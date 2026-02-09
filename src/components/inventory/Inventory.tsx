import { useRouter } from "next/router";
import React, { cloneElement, ReactElement } from "react";
import BackButton from "../ui/BackButton";

interface InventoryProps {
  outsideClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  leftPanel: React.ReactNode;
  tabContainer: React.ReactNode;
  overlayScreen?: React.ReactNode;
  topView?: React.ReactNode;
}

export default function Inventory({
  outsideClick,
  leftPanel,
  tabContainer,
  overlayScreen,
  topView,
}: InventoryProps) {
  const router = useRouter();

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <div
      className="flex flex-col desktop:flex-row desktop:justify-end relative"
      onClick={outsideClick}
    >
      {overlayScreen}
      <div className="relative desktop:fixed desktop:top-0 desktop:left-0 w-full desktop:w-[26%]">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {cloneElement(leftPanel as ReactElement<any>, { topView })}
      </div>
      <div className="flex flex-col w-full desktop:w-[74%] desktop:min-h-screen bg-[#4C539B] pb-7">
        <div
          className={`hidden desktop:flex ${topView != undefined ? "justify-between" : "justify-end"} items-center`}
        >
          {topView}
          <div className="w-16 h-16 mt-[30px] mr-[60px] [&>a]:w-16 [&>a]:h-16 [&>a>button]:w-full [&>a>button]:h-full">
            <BackButton onClick={handleBackClick} />
          </div>
        </div>
        <div className="mt-5 mx-[31px] flex-grow">{tabContainer}</div>
      </div>
    </div>
  );
}
