import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  text = "Hey there! Don’t forget to take your medicine at 12:00!!",
}) => {
  return (
    <div className="tall:w-72 mobile:w-48 tiny:w-98 tablet:w-60 short:w-84 desktop:w-72 lg:w-80 xl:w-96 2xl:w-[32rem] 4xl:w-[43.75rem] mobile:leading-[1rem] largeDesktop:leading-[4rem]">
      <div className="w-full mobile:p-4 desktop:p-8 bg-white tiny:text-xl short:text-2xl mobile:text-md tablet:text-xl desktop:text-3xl largeDesktop:text-4xl font-bold text-[#343859] text-center shadow-bubble font-quantico">
        {text}
      </div>
      <div className="h-10 w-10 ml-12 relative">
        <Image src="/misc/BubbleCorner.svg" alt="Chat Bubble Decoration" fill />
      </div>
    </div>
  );
};

export default Bubble;
