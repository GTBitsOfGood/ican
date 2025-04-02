import { useRouter } from "next/router";
import React from "react";

interface InventoryProps {
  outsideClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  leftPanel: React.ReactNode;
  tabContainer: React.ReactNode;
  overlayScreen?: React.ReactNode;
}

export default function Inventory({
  outsideClick,
  leftPanel,
  tabContainer,
  overlayScreen,
}: InventoryProps) {
  const router = useRouter();
  return (
    <div className="flex justify-end relative" onClick={outsideClick}>
      {overlayScreen}
      <div className="fixed top-0 left-0 w-[26%]">{leftPanel}</div>
      <div className="flex flex-col w-[74%] min-h-screen bg-[#4C539B] pb-7">
        <div className="flex justify-end items-center">
          <div
            className="font-pixelify mt-[30px] pr-[60px] text-icanGreen-100 text-7xl leading-none cursor-pointer"
            onClick={() => router.push("/")}
          >
            x
          </div>
        </div>
        <div className="mt-5 mx-[31px] flex-grow">{tabContainer}</div>
      </div>
    </div>
  );
}
