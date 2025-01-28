import Profile from "@/components/ui/profile";
import Navbar from "@/components/ui/navbar";
import Button from "@/components/ui/button";

import Image from "next/image";

// Make CSS files for (profile, navbar, buttons)
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">

      <div className="flex-1 bg-[url('/bg-home.png')] bg-cover bg-center">
        <div className="h-56 px-16 py-8 bg-[#2c3694] justify-start items-center gap-[50px] inline-flex">
          <Profile />
          
        </div>
        {/* Temporarily here for now, need to somehow align this with the profile */}
        <div className="flex flex-col gap-12 justify-center py-3 px-6">
          <Button buttonType='settings' drawButton={false}/>
          <Button buttonType='help' drawButton={false}/>
        </div>
        <div>
        </div>
      </div>

      <Navbar>
        <Button buttonType='store'/>
        <Button buttonType='log'/>
        <Button buttonType='bag'/>
      </Navbar>

      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/4 h-2/5">
          <Image
            src="/characters/duck.png"
            alt="pet"
            fill
            className="object-contain"
          />
      </div>
    </div>
  );
}

