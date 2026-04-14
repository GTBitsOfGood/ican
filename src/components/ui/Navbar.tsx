import Image from "next/image";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="flex h-16 w-full items-end justify-center gap-4 border-t-4 border-[#222540] bg-[#2c326a] pb-4 box-border mobile:gap-2 4xl:h-24 4xl:gap-24 4xl:pb-6">
      <div className="flex-1 mr-3" />

      <div className="flex justify-center items-center gap-4">{children}</div>

      <div className="mr-3 flex flex-1 items-center justify-end 4xl:pb-1">
        <Image
          src="/icanLogo.svg"
          alt="ICAN Logo"
          width={100}
          height={100}
          draggable={false}
          className="pointer-events-none h-auto w-[100px] object-contain"
        />
      </div>
    </div>
  );
};

export default Navbar;
