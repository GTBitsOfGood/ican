import Image from "next/image";
import { ReactTabsFunctionComponent, Tab, TabProps } from "react-tabs";

interface InventoryTabProps extends TabProps {
  title: string;
  image: string;
}

const InventoryTab: ReactTabsFunctionComponent<InventoryTabProps> = ({
  title,
  image,
  disabled,
  ...props
}) => (
  <Tab
    {...props}
    disabled={disabled}
    className={`flex-1 text-center py-4 border-x-2 border-t-2 border-white largeDesktop:h-[154px] desktop:h-[130px] tablet:h-[100px] bg-icanBlue-300 text-white outline-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    selectedClassName="translate-y-[.075px] !text-black !underline !bg-icanBlue-100 !border-b-icanBlue-100"
    disabledClassName="opacity-50 cursor-not-allowed"
  >
    <Image
      src={image}
      alt={title}
      draggable="false"
      className="mx-auto largeDesktop:w-[67px] desktop:w-[55px] tablet:w-[42px] mb-2"
      height={0}
      width={0}
      sizes="100vw"
    />
    <span className="font-quantico largeDesktop:text-[24px] desktop:w-[20px] tablet:text-[16px] font-bold">
      {title}
    </span>
  </Tab>
);

InventoryTab.tabsRole = "Tab";
export default InventoryTab;
