import { JSX } from "react";

export interface OptionProps {
  value: string;
  selected?: boolean;
  showDropDown?: boolean;
  icon?: JSX.Element;
  onClick?: () => void;
  children?: string;
  className?: string;
}

export default function Option({
  value,
  icon,
  onClick,
  selected = false,
  showDropDown = false,
  children,
  className,
}: OptionProps) {
  if (selected) {
    return (
      <div
        className={`${className} flex justify-between items-center gap-3 px-2 tablet:px-4 h-[40px] tablet:h-[52px] cursor-pointer noSelect`}
        onClick={onClick}
      >
        <div className="flex justify-start items-center gap-2">
          {icon}
          {children || value}
        </div>
        <svg
          className={`${showDropDown ? "rotate-180" : ""} w-5 h-5 tablet:w-7 tablet:h-7`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 14"
          fill="none"
        >
          <path
            d="M22.5 1.75L12 12.25L1.5 1.75"
            stroke="black"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`noSelect flex justify-start items-center gap-2 px-2 tablet:px-4 py-1 tablet:py-2 ${!selected ? "hover:bg-gray-200" : ""} cursor-pointer`}
      onClick={onClick}
    >
      {icon}
      {children || value}
    </div>
  );
}
