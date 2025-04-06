import Image from "next/image";
import { InventoryItem } from "@/types/inventory";

interface PurchaseScreenProps {
  item: InventoryItem;
  setDismiss: () => void;
}

const PurchaseScreen: React.FC<PurchaseScreenProps> = ({
  item,
  setDismiss,
}) => (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
    onClick={setDismiss}
  >
    <div className="relative largeDesktop:w-[1032px] desktop:w-[900px] tablet:w-[780px]">
      <Image
        src="/store/Buy_Message.svg"
        alt="Purchase Successful"
        width={1032}
        height={606}
        className="object-contain"
      />
      {item && item.image && (
        <div className="absolute largeDesktop:w-[150px] desktop:w-[130px] tablet:w-[110px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[32%]">
          <Image
            src={item.image}
            alt={item.displayName}
            width={150}
            height={86}
            className="object-contain mx-auto"
          />
          <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
            {item.displayName}
          </div>
        </div>
      )}
    </div>
  </div>
);

export default PurchaseScreen;
