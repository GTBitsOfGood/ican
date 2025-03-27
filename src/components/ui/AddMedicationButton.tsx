import React from "react";

export default function AddMedicationButton() {
  return (
    <a
      className="flex bg-transparent h-full w-auto justify-center items-stretch"
      href={"/add-new-medication"}
    >
      <button className="border-2 border-black border-solid p-2 pb-[0.75rem] bg-icanGreen-100 w-full h-full flex justify-center items-center">
        <span className="font-quantico text-black mobile:text-lg desktop:text-xl">
          ADD NEW{" "}
          <span className="font-quantico font-bold mobile:text-2xl desktop:text-3xl">
            +
          </span>
        </span>
      </button>
    </a>
  );
}
