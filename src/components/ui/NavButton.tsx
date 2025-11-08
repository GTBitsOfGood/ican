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

  const buttonClasses = drawButton ? "px-10" : "aspect-square";

  return (
    <button
      onClick={redirect}
      className={`z-10 relative mobile:h-[2rem] tablet:h-[3.25rem] desktop:h-[4.5rem] largeDesktop:h-[5.5rem] cursor-pointer border-none bg-transparent ${buttonClasses}`}
      type="button"
    >
      <div className="w-full h-full">
        <Image
          src={"/misc/NavButton.svg"}
          alt={buttonType}
          fill
          className="absolute inset-0 object-fill pointer-events-none"
        />

        <div className="w-full h-full flex items-center mobile:justify-center mobile:pb-1 tablet:pb-3 desktop:pb-3 largeDesktop:pb-4 4xl:pb-5 4xl:gap-1">
          <div className="relative mobile:h-[60%] tablet:h-[75%] w-auto aspect-square">
            <Image
              src={iconURL}
              alt={buttonType}
              width={80}
              height={80}
              className="object-contain pointer-events-none"
            />
          </div>
          {drawButton && (
            <div className="mobile:hidden tablet:inline-flex h-fit z-10 justify-center items-center mt-1 ml-3">
              <span className="font-quantico text-center text-white mobile:text-3xl largeDesktop:text-4xl 4xl:text-5xl font-bold leading-9 text-stroke-4 text-stroke-[#353859] text-shadow-[#4C539B] paint-stroke letter-spacing-ui">
                {buttonType.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export default Button;
