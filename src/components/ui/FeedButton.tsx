import { useRouter } from "next/router";

const FeedButton = ({}) => {
  const router = useRouter();

  const redirect = () => {
    router.push(`/food`);
  };

  return (
    <button
      className="relative aspect-feed-button mobile:h-[2rem] tablet:h-[3.25rem] desktop:h-[4.5rem] largeDesktop:h-[5.5rem] cursor-pointer"
      type="button"
      onClick={redirect}
    >
      <div
        className="w-full h-full left-0 top-0 absolute bg-gradient-to-b 
        from-[#accc6e] via-[#7b9449] to-[#365914] 
        border-4 border-[#1a2107]/40 flex justify-center items-center"
      >
        <div
          className="w-[91.5%] h-[86.5%] bg-gradient-to-b from-[#accc6e] to-[#739935] 
          shadow-inner border-4 border-t-0 border-[#b7c982]/40"
        >
          <div className="h-full w-full flex justify-center items-center">
            <span className="font-quantico text-center text-white mobile:text-xl tablet:text-2xl desktop:text-4xl largeDesktop:text-5xl 4xl:text-6xl font-bold leading-9 text-stroke-4 text-stroke-[#516C05] text-shadow-[#798C3F] paint-stroke letter-spacing-ui">
              {" "}
              FEED{" "}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default FeedButton;
