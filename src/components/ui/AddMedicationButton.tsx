import React from "react";

export default function AddMedicationButton() {
  return (
    <a
      className="flex bg-icanGreen-100 w-auto justify-center items-stretch rounded-xl border border-black overflow-hidden"
      href={"/medications/add"}
    >
      <button className="px-4 py-1.5 w-full flex justify-center items-center">
        <span className="font-quantico text-black mobile:text-lg desktop:text-xl">
          <span className="mobile:hidden desktop:inline">ADD NEW </span>
          <span className="font-quantico font-bold mobile:text-2xl desktop:text-3xl">
            +
          </span>
          <span className="mobile:inline desktop:hidden"> Add New</span>
        </span>
      </button>
    </a>
  );
}
