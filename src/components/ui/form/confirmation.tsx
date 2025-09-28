import React from "react";

interface ConfirmationProps {
  text: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export default function Confirmation({
  text,
  checked = false,
  onChange,
}: ConfirmationProps) {
  const handleClick = () => {
    onChange?.(!checked);
  };

  return (
    <div className="flex items-center gap-2 desktop:gap-4 cursor-pointer">
      <div
        className="w-6 h-6 rounded-full border-2 border-blue-700 bg-indigo-50 flex items-center justify-center select-none flex-shrink-0"
        onClick={handleClick}
      >
        {checked && <div className="w-3 h-3 bg-blue-700 rounded-full"></div>}
      </div>
      <p className="text-white text-xl desktop:text-3xl font-normal font-quantico flex-1">
        {text}
      </p>
    </div>
  );
}
