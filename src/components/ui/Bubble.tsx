import Image from "next/image";

interface BubbleProps {
  text?: string;
}

const Bubble: React.FC<BubbleProps> = ({
  text = "Hey there! Don't forget to take your medicine at 12:00!!",
}) => {
  return (
    <div className="relative w-96">
      <Image
        src="/misc/messagebubble.svg"
        alt="Speech Bubble"
        width={600}
        height={400}
      />

      <div className="absolute top-[15%] left-[5%] right-[5%] bottom-[25%] flex items-center justify-center px-4">
        <p className="text-2xl font-bold text-[#343859] text-center font-quantico leading-tight">
          {text}
        </p>
      </div>
    </div>
  );
};

export default Bubble;
