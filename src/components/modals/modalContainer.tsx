import { ReactNode, Dispatch, SetStateAction } from "react";

interface modalContainerProps {
  children: ReactNode;
  className?: string;
  title: string;
  setVisibility: Dispatch<SetStateAction<boolean>>;
}

export default function ModalContainer({
  children,
  className,
  title,
  setVisibility,
}: modalContainerProps) {
  return (
    <div
      className={`z-30 absolute top-1/2 left-1/2 translate -translate-x-1/2 -translate-y-1/2 shadow-lg p-16 ${className}`}
    >
      <div className="flex justify-between">
        <div className="font-quantico border-b-2 font-bold text-3xl">
          {title}
        </div>
        <div
          className="font-pixelify text-3xl cursor-pointer"
          onClick={() => setVisibility(false)}
        >
          X
        </div>
      </div>
      {children}
    </div>
  );
}
