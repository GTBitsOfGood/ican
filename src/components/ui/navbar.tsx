interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  return (
    <div className="w-full h-24 px-20 pb-6 box-border bg-[#2c326a] border-t-4 border-[#222540] justify-center items-end gap-[104px] flex">
      {children}
    </div>
  );
};

export default Navbar;