import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({ text = "Hey there! Don’t forget to take your medicine at 12:00!!" }) => {
  return (
    <div className="w-72 lg:w-80 xl:w-96 2xl:w-[32rem] 4xl:w-[43.75rem] leading-[4rem]">
      <div className="w-full p-8 bg-white text-4xl font-bold text-[#343859] text-center shadow-bubble font-quantico">
        {text}
      </div>
      <div className="h-10 w-10 ml-12 relative">
        <Image
          src="/misc/chatBubbleCorner.svg"
          alt="Chat Bubble Decoration"
          fill
        />
      </div>
    </div>
  )
}

export default Bubble