import React from "react";
import LogPasswordModal from "../modals/LogPasswordModal";
import { useDisclosure } from "@heroui/react";
import { cn } from "@/lib/utils";

interface ModalNextButtonProps {
  link: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  requirePin?: boolean;
  preventNavigation?: boolean;
  disabled?: boolean;
}

export default function ModalNextButton({
  link,
  onClick,
  requirePin,
  preventNavigation,
  disabled,
}: ModalNextButtonProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }
    if (requirePin == true) {
      onOpen();
    } else {
      if (onClick) {
        e.preventDefault();
        await onClick(e);
      }
      if (!preventNavigation) {
        window.location.href = link;
      }
    }
  };

  return (
    <>
      {isOpen && (
        <LogPasswordModal
          isOpen={isOpen}
          onClose={onClose}
          handleNext={onClick}
          link={link}
        />
      )}
      <div
        className={cn(
          "flex bg-white w-[26%] p-2 justify-center items-stretch",
          disabled && "opacity-50 cursor-not-allowed",
        )}
      >
        <button
          className="w-full h-full flex justify-center items-center"
          onClick={handleClick}
          disabled={disabled}
        >
          <svg
            fill="black"
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path
              d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
              fill="black"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
