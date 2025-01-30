import Image from "next/image";
import { useRouter } from "next/router";

type ButtonType = "bag" | "help" | "log" | "settings" | "store";

interface ButtonProps {
  buttonType: ButtonType;
  drawButton?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  buttonType = "store",
  drawButton = true,
}) => {
  const router = useRouter();
  // Switch to SVG later
  const iconURL = `/icons/${buttonType}.png`;
  const label = buttonType.toUpperCase();

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
              shadow-[0px_0px_0px_2px_rgba(61,112,201,0.40),inset_0px_2px_1px_0px_rgba(0,0,0,0.25)] 
              border-4 border-[#13173c]/40 flex justify-center items-center"
            >
              <div
                className="w-[91.5%] h-[86.5%] bg-gradient-to-b from-[#7d83b2] to-[#535677] 
                shadow-[inset_0px_4px_0px_0px_rgba(183,189,239,1.00)] border-4 border-t-0 border-[#7d83b2]/40"
              />
            </div>
          </>
        )}

        {/* I don't like this logic for making the icons stick out at all, change later with abs positioning some other way */}
        <div className="w-full h-full z-10 flex flex-col items-center justify-end pb-[20px] gap-1">
          <div className="relative h-20 w-auto aspect-square">
            {/* SVG? */}
            <Image
              src={iconURL}
              alt={label}
              width={80}
              height={80}
              className="object-contain"
            />
          </div>
          <div className="h-9 z-10 justify-center items-center inline-flex">
            <span className="font-quantico text-center text-white text-4xl font-bold leading-9 text-shadow-blue">
              {label.toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default Button;
