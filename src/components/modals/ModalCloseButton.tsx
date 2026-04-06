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
      className="absolute left-[10px] top-[8px] z-50 flex h-11 w-11 items-center justify-center font-pixelify text-5xl font-normal leading-none text-white hover:bg-white/5 active:bg-white/10 desktop:left-auto desktop:right-[2.5rem] desktop:top-[3rem] desktop:h-12 desktop:w-12 desktop:rounded-full desktop:text-6xl desktop:text-iCAN-Green"
      aria-label="Close"
    >
      <span className="block leading-none">x</span>
    </button>
  );
}
