import { ReactNode } from "react";

interface modalBackgroundProps {
  children: ReactNode;
}

export default function ModalBackground({ children }: modalBackgroundProps) {
  return (
    <div className="z-30 fixed w-full h-full bg-black/60 top-0 left-0">
      {children}
    </div>
  );
}
