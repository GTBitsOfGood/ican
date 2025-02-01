import Image from "next/image";
import { useRouter } from "next/router";

// Probably move the types into a folder
type ButtonType = "bag" | "help" | "log" | "settings" | "store" | "feed";

interface ButtonProps {
  buttonType?: ButtonType;
  drawButton?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonType = "store",
  drawButton = true,
}) => {
  const router = useRouter();
  const iconURL = `/icons/${buttonType}.png`;

  const redirect = () => {
    router.push(`/${buttonType}`);
  };

  return (
    <button
      onClick={redirect}
      className="relative aspect-nav-button min-w-44 w-44 4xl:w-[14.375rem] cursor-pointer border-none bg-transparent p-0"
      type="button"
    >
      <div className="w-full h-full">
        {drawButton && (
          <>
            <div
              className="w-full h-full left-0 top-0 absolute bg-gradient-to-b 
              from-[#9ca1c9] via-[#676ca0] to-[#2f324d] 
              border-4 border-[#13173c]/40 flex justify-center items-center"
            >
              <div
                className="w-[91.5%] h-[86.5%] bg-gradient-to-b from-[#7d83b2] to-[#535677] 
                shadow-button-inner border-4 border-t-0 border-[#7d83b2]/40"
              />
            </div>
          </>
        )}

        <div className="w-full h-full flex flex-col items-center justify-end pb-4 4xl:pb-5 4xl:gap-1">
          <div className="relative h-[75%] w-auto aspect-square">
            <Image
              src={iconURL}
              alt={buttonType}
              width={80}
              height={80}
              className="object-contain pointer-events-none"
            />
          </div>
          <div className="h-fit z-10 justify-center items-center inline-flex">
            <span className="font-quantico text-center text-white text-3xl 4xl:text-4xl font-bold leading-9 nav-button-label">
              {buttonType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
