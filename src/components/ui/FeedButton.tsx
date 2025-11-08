import { useRouter } from "next/router";
import Image from "next/image";

const FeedButton = ({ active }: { active: boolean }) => {
  const router = useRouter();

  const redirect = () => {
    router.push(`/food`);
  };

  return (
    <button
      className="z-10 relative mobile:h-[3rem] tablet:h-[3.25rem] desktop:h-[4.5rem] largeDesktop:h-[5.5rem] cursor-pointer border-none bg-transparent disabled:cursor-default disabled:grayscale px-10"
      type="button"
      onClick={redirect}
      disabled={!active}
    >
      <div className="w-full h-full">
        <Image
          src={"/misc/FeedButton.svg"}
          alt={"feed"}
          fill
          className="absolute inset-0 object-fill pointer-events-none"
        />

        <div className="w-full h-full flex items-center mobile:justify-center tablet:justify-end mobile:pb-0 tablet:pb-1 desktop:pb-3 largeDesktop:pb-4 4xl:pb-5 4xl:gap-1">
          <span className="w-full z-10 font-quantico text-center text-white mobile:text-xl tablet:text-2xl desktop:text-3xl largeDesktop:text-5xl 4xl:text-6xl font-bold leading-9 text-stroke-4 text-stroke-[#516C05] text-shadow-[#798C3F] paint-stroke letter-spacing-ui pl-1">
            FEED
          </span>
        </div>
      </div>
    </button>
  );
};

export default FeedButton;
