import React from "react";

interface ModalCloseButtonProps {
  onClose: () => void;
}

export default function ModalCloseButton({ onClose }: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute right-[1rem] top-[1rem] font-pixelify font-normal text-6xl rounded-full w-12 h-12 hover:bg-white/5 active:bg-white/10 "
    >
      <p className="relative bottom-3">x</p>
    </button>
  );
}
