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
      className="relative flex min-h-screen flex-col desktop:flex-row desktop:justify-end"
      onClick={outsideClick}
    >
      {overlayScreen}
      <div className="relative desktop:fixed desktop:top-0 desktop:left-0 w-full desktop:w-[26%]">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        {cloneElement(leftPanel as ReactElement<any>, { topView })}
      </div>
      <div className="flex min-h-screen w-full flex-col bg-[#4C539B] pb-7 desktop:w-[74%] desktop:min-h-screen">
        <div className="hidden desktop:flex items-center px-[31px] pt-[30px]">
          <div className="h-20 w-20 shrink-0">
            <BackButton onClick={handleBackClick} />
          </div>
          {topView ? (
            <>
              <div className="flex flex-1 justify-center">{topView}</div>
              <div className="h-20 w-20 shrink-0" />
            </>
          ) : (
            <div className="flex-1" />
          )}
        </div>
        <div className="mt-4 flex-grow px-4 pb-4 desktop:mt-5 desktop:mx-[31px] desktop:px-0 desktop:pb-0">
          {tabContainer}
        </div>
      </div>
    </div>
  );
}
