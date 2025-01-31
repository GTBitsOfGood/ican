import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import Profile from "@/components/ui/Profile";
import ProfileInfo from "@/components/ui/ProfileInfo";

import Image from "next/image";

// Make CSS files for (profile, navbar, buttons)
// Switch PNG's to SVGs?
// Store inline SVG's in a file instead?
// Switch from px to rem

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 bg-[url('/bg-home.png')] bg-cover bg-center">
        <div className="h-56 px-16 py-8 bg-[#2c3694] justify-start items-center gap-12 inline-flex">
          <Profile />
          <ProfileInfo />
        </div>
        {/* Temporarily here for now, might want to make a seperate componenet to keep them in? */}
        <div className="flex flex-col gap-12 justify-center py-3 px-6">
          <NavButton buttonType="settings" drawButton={false} />
          <NavButton buttonType="help" drawButton={false} />
        </div>
      </div>

      <Navbar>
        <NavButton buttonType="store" />
        <NavButton buttonType="log" />
        <NavButton buttonType="bag" />
        <FeedButton />
      </Navbar>

      {/* How to scale duck size? % or using md, lg */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[22rem] h-[31rem]">
        <Image
          src="/characters/duck.png"
          alt="pet"
          fill
          className="object-contain"
        />
      </div>

      {/* Need to find a good way to position the text-bubble + Duck so they still match up regardless to resolution */}
      <div className="absolute left-1/2 bottom-1/2 ml-40 mb-32">
        <Bubble/>
      </div>
    </div>
  );
}
