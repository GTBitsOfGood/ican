import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  text = "Hey there! Don’t forget to take your medicine at 12:00!!",
}) => {
  return (
    <div className="h-full tall:w-[14rem] mobile:w-[14rem] tiny:w-[14rem] tablet:w-[28rem] short:w-[28rem] desktop:w-[40rem] lg:w-[40rem] xl:w-116 2xl:w-[34rem] 4xl:w-[45.75rem] mobile:leading-[1rem] largeDesktop:leading-[4rem]">
      <Image
        src={"/misc/ChatBubbleTop.svg"}
        alt={"chat bubble top"}
        width={74}
        height={65}
        className="object-cover pointer-events-none w-full tall:h-[38px] mobile:h-[18px] tiny:h-[18px] tablet:h-[38px] short:h-[38px] desktop:h-[50px] lg:h-[50px] xl:h-[60px] 2xl:h-[60px] 4xl:h-[60px]"
      />
      <div className="relative inline-block -mt-[2px] px-4">
        <div className="w-full mobile:p-4 desktop:p-8 tiny:text-xl short:text-2xl mobile:text-xl tablet:text-xl desktop:text-3xl largeDesktop:text-4xl font-bold text-[#343859] text-center font-quantico">
          {text}
        </div>
        <Image
          src={"/misc/ChatBubbleMid.svg"}
          alt={"chat bubble top"}
          fill
          className="object-fill pointer-events-none absolute top-0 left-[10] w-full h-full z-[-1] ml-[0.4%]"
        />
      </div>
      <Image
        src={"/misc/ChatBubbleBottom.svg"}
        alt={"chat bubble top"}
        width={74}
        height={65}
        className="object-cover pointer-events-none -mt-[2px] w-full tall:h-[80px] mobile:h-[38px] tiny:h-[38px] tablet:h-[80px] short:h-[80px] desktop:h-[116px] lg:h-[118px] xl:h-[128px] 2xl:h-[128px] 4xl:h-[128px]"
      />
    </div>
  );
};

export default Bubble;
