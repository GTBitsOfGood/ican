import React from "react";
import LogPasswordModal from "../modals/LogPasswordModal";
import { useDisclosure } from "@heroui/react";

interface ModalNextButtonProps {
  link: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  requirePin?: boolean;
}

export default function ModalNextButton({
  link,
  onClick,
  requirePin,
}: ModalNextButtonProps) {
  //for managing pin modal
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (requirePin == true) {
      onOpen();
    } else {
      if (onClick) {
        e.preventDefault();
        await onClick(e);
      }
      window.location.href = link;
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
      <div className="flex bg-white w-[9.5%] p-2 justify-center items-stretch">
        <button
          className="w-full h-full flex justify-center items-center"
          onClick={handleClick}
        >
          <svg
            fill="black"
            className="w-8 h-8"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            {" "}
            <path
              d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
              fill="black"
            />{" "}
          </svg>
        </button>
      </div>
    </>
  );
}
