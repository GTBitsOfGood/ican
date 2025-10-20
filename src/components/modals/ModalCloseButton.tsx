import React from "react";
import Link from "next/link";

interface ModalCloseButtonProps {
  onClose: () => void;
  link?: string;
}

export default function ModalCloseButton({
  onClose,
  link = "/",
}: ModalCloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute right-[2.5rem] top-[3rem] font-pixelify font-normal text-6xl rounded-full w-12 h-12 hover:bg-white/5 active:bg-white/10"
      style={{ color: "#CEE0A0" }}
    >
      {/* <p >x</p> */}
      <Link className="relative bottom-3" href={link}>
        x
      </Link>
    </button>
  );
}
