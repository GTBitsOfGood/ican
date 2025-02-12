import { cloneElement, ReactElement, useState, useEffect, useRef } from "react";
import { OptionProps } from "./option";

interface DropDownProps {
  children: ReactElement<OptionProps>[];
  className?: string;
  width?: number;
  value: string;
  setValue: (newValue: string) => void;
}

export default function DropDown({
  children,
  className,
  width,
  value,
  setValue,
}: DropDownProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialIndex = children.findIndex(
      (child) => child.props.value === value,
    );
    if (initialIndex !== -1) {
      setSelectedIndex(initialIndex);
    }
  }, [value, children]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropDown(false);
      }
    };

    if (showDropDown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropDown]);

  const handleSelect = (index: number) => {
    setValue(children[index].props.value);
    setShowDropDown(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative border-2 border-black bg-white text-black font-belanosima text-2xl ${className}`}
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
        <div className="absolute -left-[2px] top-[calc(100%-1px)] z-10 w-[calc(100%+4px)] bg-white border-t-0 border-2 border-black flex flex-col gap-2">
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
