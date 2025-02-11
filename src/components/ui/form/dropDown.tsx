import { cloneElement, ReactElement, useState, useEffect } from "react";
import { OptionProps } from "./option";

interface DropDownProps {
  children: ReactElement<OptionProps>[];
  className?: string;
  absolute?: boolean;
  width?: number;
  value: string;
  setValue: (newValue: string) => void;
}

export default function DropDown({
  children,
  className,
  absolute = false,
  width,
  value,
  setValue,
}: DropDownProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  useEffect(() => {
    const initialIndex = children.findIndex(
      (child) => child.props.value === value,
    );
    if (initialIndex !== -1) {
      setSelectedIndex(initialIndex);
    }
  }, [value, children]);

  const handleSelect = (index: number) => {
    setValue(children[index].props.value);
    setShowDropDown(false);
  };

  return (
    <div
      className={`relative border-2 border-black bg-white text-black font-belanosima text-2xl ${absolute && showDropDown ? "border-b-0" : ""} ${className}`}
      style={{
        width: width || 130,
      }}
    >
      {/* Dropdown Button */}
      {cloneElement(children[selectedIndex], {
        showDropDown,
        selected: true,
        onClick: () => setShowDropDown((prev) => !prev),
      })}

      {/* Dropdown Menu */}
      {showDropDown && (
        <div
          className={`${absolute ? "absolute -left-[2px] top-[calc(100%-1px)] z-10 w-[calc(100%+4px)] bg-white border-t-0 border-2 border-black" : ""} flex flex-col gap-2`}
        >
          {children.map((child, index) => {
            if (index != selectedIndex) {
              return cloneElement(child, {
                key: index,
                selected: false,
                onClick: () => handleSelect(index),
              });
            }
          })}
        </div>
      )}
    </div>
  );
}
