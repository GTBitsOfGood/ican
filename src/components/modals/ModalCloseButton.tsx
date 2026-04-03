import { useRouter } from "next/router";
import React from "react";

interface ModalCloseButtonProps {
  onClose: () => void;
  link?: string;
}

export default function ModalCloseButton({
  onClose,
  link,
}: ModalCloseButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    onClose();

    if (link) {
      void router.push(link);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="absolute z-50 right-[2.5rem] top-[3rem] font-pixelify font-normal text-6xl rounded-full w-12 h-12 hover:bg-white/5 active:bg-white/10 text-iCAN-Green"
      aria-label="Close"
    >
      <span className="relative bottom-3">x</span>
    </button>
  );
}
