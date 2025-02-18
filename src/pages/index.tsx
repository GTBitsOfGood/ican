import Image from "next/image";
import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import { characterImages } from "@/types/characters";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import { useEffect, useState } from "react";
import { petService } from "@/http/petService";
import { Pet } from "@/types/pet";

export default function Home() {
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet>();

  useEffect(() => {
    const getPetData = async () => {
      if (userId) {
        try {
          const pet = await petService.getPet(userId);
          if (pet) {
            setPetData(pet);
            console.log("Fetched pet data:", pet);
          } else {
            console.log("No pet data found for userId:", userId);
          }
        } catch (error) {
          console.error("Error fetching pet data:", error);
        }
      }
    };

    getPetData();
  }, [userId]);

  return (
    <AuthorizedRoute>
      {petData ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.png')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <div className="flex h-52 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
              <ProfilePicture character={petData.petType} />
              <ProfileInfo
                name={petData.name}
                level={petData.xpLevel}
                coins={petData.coins}
                currentExp={petData.xpGained}
              />
            </div>
            {/* Side Bar */}
            <div className="flex flex-col gap-9 w-fit 4xl:gap-12 justify-center pt-3 px-2 4xl:px-6">
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
                src={characterImages[petData.petType]}
                alt="pet"
                width={characterImages[petData.petType].width}
                height={characterImages[petData.petType].height}
                draggable={false}
                className="select-none h-full w-auto object-contain"
              />
              <div className="absolute left-[100%] bottom-[75%]">
                <Bubble />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.png')] bg-cover bg-center bg-no-repeat">
            <div className="flex justify-center items-center h-screen">
              <Image
                className="spin"
                src="/loading.svg"
                alt="loading"
                width={100}
                height={100}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          </div>
        </div>
      )}
    </AuthorizedRoute>
  );
}
