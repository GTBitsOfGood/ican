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
  const iconURL = `/icons/${buttonType}.svg`;

  const redirect = () => {
    router.push(`/${buttonType}`);
  };

  return (
    <button
      onClick={redirect}
      className="z-10 relative aspect-nav-button mobile:h-[2rem] tablet:h-[3.25rem] desktop:h-[4.5rem] largeDesktop:h-[5.5rem] cursor-pointer border-none bg-transparent p-0"
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

        <div className="w-full h-full flex flex-col items-center mobile:justify-center tablet:justify-end mobile:pb-0 tablet:pb-1 desktop:pb-3 largeDesktop:pb-4 4xl:pb-5 4xl:gap-1">
          <div className="relative mobile:h-[60%] tablet:h-[75%] w-auto aspect-square">
            <Image
              src={iconURL}
              alt={buttonType}
              width={80}
              height={80}
              className="object-contain pointer-events-none"
            />
          </div>
          <div className="mobile:hidden tablet:inline-flex h-fit z-10 justify-center items-center">
            <span className="font-quantico text-center text-white mobile:text-lg largeDesktop:text-3xl 4xl:text-4xl font-bold leading-9 text-stroke-4 text-stroke-[#353859] text-shadow-[#7D83B2] paint-stroke letter-spacing-ui">
              {buttonType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
