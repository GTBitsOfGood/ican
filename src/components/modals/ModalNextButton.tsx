import React from "react";

interface ModalNextButtonProps {
  link: string;
  onClick?: () => void;
}

export default function ModalNextButton({
  link,
  onClick,
}: ModalNextButtonProps) {
  return (
    <a
      className="flex bg-white w-[9.5%] p-2 justify-center items-stretch"
      href={link}
      onClick={onClick}
    >
      <button className="w-full h-full flex justify-center items-center">
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
    </a>
  );
}
