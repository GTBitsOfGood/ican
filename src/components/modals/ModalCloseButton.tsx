import React from "react";
import Link from "next/link";

interface ModalCloseButtonProps {
  onClose: () => void;
}

export default function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute right-[2.5rem] top-[3rem] font-pixelify font-normal text-6xl rounded-full w-12 h-12 hover:bg-white/5 active:bg-white/10 text-iCAN-Green"
    >
      {/* <p >x</p> */}
      <Link className="relative bottom-3" href="/">
        x
      </Link>
    </button>
  );
}
