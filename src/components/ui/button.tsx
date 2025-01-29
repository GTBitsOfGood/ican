import Image from "next/image";
import { useRouter } from "next/router";

type ButtonType = "bag" | "help" | "log" | "settings" | "store";

const IconMap: Record<ButtonType, string> = {
  bag: "/icons/bag.png",
  help: "/icons/help.png",
  log: "/icons/log.png",
  settings: "/icons/settings.png",
  store: "/icons/store.png",
};

interface ButtonProps {
  buttonType: ButtonType;
  drawButton?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonType = "store",
  drawButton = true,
}) => {
  const router = useRouter();
  const iconURL = IconMap[buttonType];
  const name = buttonType.toUpperCase();

  const redirect = () => {
    router.push(`/${buttonType}`);
  };

  return (
    <button
      onClick={redirect}
      className="w-[230px] h-[120px] relative cursor-pointer border-none bg-transparent p-0"
      type="button"
    >
      <div className="w-full h-full relative">
        {drawButton && (
          <>
            {/* Need to fix the logic for positioning these too or just turn it into an SVG */}
            <div
              className="w-[230px] h-[120px] left-0 top-0 absolute bg-gradient-to-b 
            from-[#9ca1c9] via-[#676ca0] to-[#2f324d] 
            shadow-[0px_0px_0px_2px_rgba(61,112,201,0.40),inset_0px_2px_1px_0px_rgba(0,0,0,0.25)] 
            border-4 border-[#13173c]/40"
            />
            <div
              className="w-[202.94px] h-[96.64px] left-[13.53px] top-[11.68px] absolute 
            bg-gradient-to-b from-[#7d83b2] to-[#535677] shadow-[inset_0px_4px_0px_0px_rgba(183,189,239,1.00)] 
            border-4 border-t-0 border-[#7d83b2]/40"
            />
          </>
        )}

        {/* I don't like this logic for making the icons stick out at all, change later with abs positioning some other way */}
        <div className="w-full h-full z-10 flex flex-col items-center justify-end pb-[20px] gap-1">
          <div className="relative h-20 w-auto aspect-square">
            {/* SVG? */}
            <Image
              src={iconURL}
              alt={`${name}`}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="h-9 z-10 justify-center items-center inline-flex">
            <span className="font-quantico text-center text-white text-4xl font-bold leading-9 text-shadow-blue">
              {" "}
              {name}{" "}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
