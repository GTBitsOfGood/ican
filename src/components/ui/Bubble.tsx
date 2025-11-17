import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  text = "Hey there! Don’t forget to take your medicine at 12:00!!",
}) => {
  return (
    <div className="tall:w-[14rem] mobile:w-[14rem] tiny:w-[14rem] tablet:w-[24rem] short:w-[24rem] desktop:w-[34rem] lg:w-[34rem] xl:w-116 2xl:w-[34rem] 4xl:w-[45.75rem] mobile:leading-[1rem] largeDesktop:leading-[4rem]">
      <Image
        src={"/misc/ChatBubbleTop.svg"}
        alt={"chat bubble top"}
        width={74}
        height={65}
        className="object-fill pointer-events-none w-full h-full"
      />
      <div className="relative inline-block -mt-1">
        <div className="w-full mobile:p-4 desktop:p-8 tiny:text-xl short:text-2xl mobile:text-xl tablet:text-xl desktop:text-3xl largeDesktop:text-4xl font-bold text-[#343859] text-center font-quantico">
          {text}
        </div>
        <Image
          src={"/misc/ChatBubbleMid.svg"}
          alt={"chat bubble top"}
          fill
          className="object-fill pointer-events-none absolute top-0 left-[10] w-full h-full z-[-1] ml-[0.3%]"
        />
      </div>
      <Image
        src={"/misc/ChatBubbleBottom.svg"}
        alt={"chat bubble top"}
        width={74}
        height={65}
        className="object-fill pointer-events-none w-full h-full -mt-1"
      />
    </div>
  );
};

export default Bubble;
