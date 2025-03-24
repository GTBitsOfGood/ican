import { cloneElement, ReactElement, useState, useEffect, useRef } from "react";
import Option, { OptionProps } from "./option";

interface DropDownProps {
  children: ReactElement<OptionProps>[];
  className?: string;
  disabled?: boolean;
  width?: number;
  value: string;
  setValue: (newValue: string) => void;
}

export default function DropDown({
  children,
  className,
  disabled = false,
  width = 130,
  value,
  setValue,
}: DropDownProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);
  const [currentX, setCurrentX] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setCurrentX(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const initialIndex = children.findIndex(
      (child) => child.props.value === value,
    );
    setSelectedIndex(initialIndex);
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
    if (!disabled) {
      setValue(children[index].props.value);
      setShowDropDown(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative border-2 border-black bg-white text-black font-belanosima text-lg tablet:text-2xl ${className} ${disabled ? "opacity-40" : ""}`}
      style={{
        width: currentX && currentX < 768 ? width / 1.5 : width,
      }}
    >
      {/* Dropdown Button */}
      {selectedIndex === -1 ? (
        <Option
          value="Select"
          selected={true}
          onClick={() => setShowDropDown((prev) => !prev)}
          className="!text-slate-900/75"
        />
      ) : (
        cloneElement(children[selectedIndex], {
          showDropDown,
          selected: true,
          onClick: () => {
            if (!disabled) {
              setShowDropDown((prev) => !prev);
            }
          },
        })
      )}

      {/* Dropdown Menu */}
      {!disabled && showDropDown && (
        <div className="absolute -left-[2px] top-[calc(100%-1px)] z-10 w-[calc(100%+4px)] bg-white border-t-0 border-2 border-black flex flex-col">
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
