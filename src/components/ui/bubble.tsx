import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({ text = "Hey there! Don’t forget to take your medicine at 12:00!!" }) => {
  return (
    <div className="w-[43.75rem]">
      <div className="w-full p-8 bg-white text-4xl font-bold text-black text-center shadow-bubble">
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