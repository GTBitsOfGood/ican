import React from "react";

interface ModalSwitchProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ModalSwitch({ state, setState }: ModalSwitchProps) {
  return (
    <div className="flex w-[9.5%] h-12 py-2 px-[0.75rem] border-2 border-white items-center">
      <div
        className="relative w-full h-full cursor-pointer"
        onClick={() => setState(!state)}
      >
        <div
          className={`absolute left-0 cursor-pointer my-[0.125rem] w-[1.5rem] h-[1.5rem] transition-transform duration-300 ${state ? " transform translate-x-12 bg-icanGreen-300" : "transform translate-x-0 bg-icanBlue-100"} `}
        ></div>
        <p className={`absolute text-lg ${state ? "left-2" : "right-2"}`}>
          {state ? "ON" : "OFF"}
        </p>
      </div>
    </div>
  );
}
