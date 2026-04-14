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
    className={`min-w-[110px] flex-1 border-x-2 border-t-2 border-white bg-icanBlue-300 py-4 text-center text-white outline-none tablet:h-[100px] desktop:h-[130px] largeDesktop:h-[154px] ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    selectedClassName="translate-y-[.075px] !text-black !underline !bg-icanBlue-100 !border-b-icanBlue-100"
    disabledClassName="opacity-50 cursor-not-allowed"
  >
    <Image
      src={image}
      alt={title}
      draggable="false"
      className="mx-auto mb-2 tablet:w-[42px] desktop:w-[55px] largeDesktop:w-[67px]"
      height={0}
      width={0}
      sizes="100vw"
    />
    <span className="font-quantico text-[14px] font-bold tablet:text-[16px] desktop:w-[20px] largeDesktop:text-[24px]">
      {title}
    </span>
  </Tab>
);

InventoryTab.tabsRole = "Tab";
export default InventoryTab;
