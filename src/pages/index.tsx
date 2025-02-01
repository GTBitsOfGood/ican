import Image from "next/image";
import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import { characterImages } from "@/types/characters"; // Importing gives you width/height info

export default function Home() {
  const pet = 'duck'
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 bg-[url('/bg-home.png')] bg-cover bg-center bg-no-repeat">
        
        {/* Profile */}
        <div className="flex h-52 4xl:h-56 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 px-10 4xl:gap-12 4xl:px-16">
          <ProfilePicture character="duck"/>
          <ProfileInfo name="Name" level={7} coins={100} currentExp={50}/>
        </div>

        {/* Side Bar */}
        <div className="flex flex-col w-fit gap-9 4xl:gap-12 justify-center pt-3 px-2 4xl:px-6">
          <NavButton buttonType="settings" drawButton={false} />
          <NavButton buttonType="help" drawButton={false} />
        </div>
      </div>

      {/* Navbar - VH Scaling */}
      <Navbar>
        <NavButton buttonType="store" />
        <NavButton buttonType="log" />
        <NavButton buttonType="bag" />
        <FeedButton />
      </Navbar>

      {/* Character, speech bubble is made relative to the image */}
      <div className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
        <div className="relative min-h-60 w-full h-full">
          <Image
            src={characterImages[pet]}
            alt="pet"
            width={characterImages[pet].width}
            height={characterImages[pet].height}
            draggable={false}
            className="select-none h-full w-auto object-contain"
          />
        <div className="absolute left-[100%] bottom-[75%]">
          <Bubble/>
        </div>
        </div>
      </div>
    </div>
  );
}
