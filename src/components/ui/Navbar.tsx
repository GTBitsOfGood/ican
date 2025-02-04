interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="w-full h-16 pb-4 box-border gap-16 bg-[#2c326a] border-t-4 border-[#222540] justify-center items-end 4xl:h-24 4xl:pb-6 4xl:gap-24 flex">
      {children}
    </div>
  );
};

export default Navbar;
