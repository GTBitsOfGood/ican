import Image from "next/image";
import { useRouter } from "next/router";

// Probably move the types into a folder
type ButtonType = "bag" | "help" | "log" | "settings" | "store" | "feed";

interface ButtonProps {
  buttonType?: ButtonType;
  drawButton?: boolean;
}

const Button: React.FC<ButtonProps> = ({ buttonType = "store", drawButton = true }) => {
  const router = useRouter();
  // Switch to SVG later
  const iconURL = `/icons/${buttonType}.png`;

  // Pass the onclick logic as a prop?
  const redirect = () => {
    router.push(`/${buttonType}`);
  };

  return (
    <button
      onClick={redirect}
      className="w-[14.375rem] h-[7.5rem] relative cursor-pointer border-none bg-transparent p-0"
      type="button"
    >
      <div className="w-full h-full">
        {drawButton && (
          <>
            {/* The border of the inner div doesn't match the Figma, I might have to use an SVG instead? */}
            <div
              className="w-full h-full left-0 top-0 absolute bg-gradient-to-b 
              from-[#9ca1c9] via-[#676ca0] to-[#2f324d] 
              shadow-button-outer
              border-4 border-[#13173c]/40 flex justify-center items-center"
            >
              <div
                className="w-[91.5%] h-[86.5%] bg-gradient-to-b from-[#7d83b2] to-[#535677] 
                shadow-button-inner border-4 border-t-0 border-[#7d83b2]/40"
              />
            </div>
          </>
        )}

        {/* I don't like this logic for making the icons stick out, I will reorganize / experiment with this (put it into the div above?) */}
        <div className="w-full h-full z-10 flex flex-col items-center justify-end pb-[20px] gap-1">
          <div className="relative h-20 w-auto aspect-square">
            {/* Will probably switch the Icons over to SVG's */}
            <Image
              src={iconURL}
              alt={buttonType}
              width={80}
              height={80}
              className="object-contain pointer-events-none"
            />
          </div>
          <div className="h-9 z-10 justify-center items-center inline-flex">
            <span className="font-quantico text-center text-white text-4xl font-bold leading-9 text-shadow-blue">
              {buttonType.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
