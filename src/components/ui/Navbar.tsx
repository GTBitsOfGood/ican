import Image from "next/image";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="w-full h-16 pb-4 box-border mobile:gap-2 desktop:gap-4 bg-[#2c326a] border-t-4 border-[#222540] justify-center items-end 4xl:h-24 4xl:pb-6 4xl:gap-24 flex">
      <div className="flex-1 mr-3" />

      <div className="flex justify-center items-center gap-4">{children}</div>

      <div className="flex items-center justify-end flex-1 mr-3">
        <Image
          src={"./icanLogo.svg"}
          alt={"ICAN Logo"}
          width={100}
          height={100}
          style={{ pointerEvents: "none" }}
        />
      </div>
    </div>
  );
};

export default Navbar;
