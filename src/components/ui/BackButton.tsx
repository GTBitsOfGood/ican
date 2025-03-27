import React from "react";

interface BackButtonProps {
  link: string;
}

export default function BackButton({ link }: BackButtonProps) {
  return (
    <a
      className="flex bg-transparent w-[5%] p-2 justify-center items-stretch"
      href={link}
    >
      <button className="w-full h-full flex justify-center items-center">
        <svg
          className="fill-icanGreen-100"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            className="fill-icanGreen-100"
            d="M20 11v2H8v2H6v-2H4v-2h2V9h2v2h12zM10 7H8v2h2V7zm0 0h2V5h-2v2zm0 10H8v-2h2v2zm0 0h2v2h-2v-2z"
          />
        </svg>
      </button>
    </a>
  );
}
