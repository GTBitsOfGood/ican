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
    <div className="flex items-center gap-4 cursor-pointer">
      <div
        className="w-6 h-6 rounded-full border-2 flex items-center justify-center select-none"
        onClick={handleClick}
      >
        {checked && <div className="w-3 h-3 bg-white rounded-full"></div>}
      </div>
      <p className="text-white text-3xl font-normal font-quantico">{text}</p>
    </div>
  );
}
