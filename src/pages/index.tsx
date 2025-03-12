import Image from "next/image";
import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import { characterImages } from "@/types/characters";
import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import { useEffect, useState } from "react";
import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import AddMedicationModal from "@/components/modals/medication/addMedicationModal";
import EditMedicationModal from "@/components/modals/medication/editMedicationModal";
import { WithId } from "@/types/models";
import { Medication } from "@/db/models/medication";
import LoadingScreen from "@/components/loadingScreen";

interface HomeProps {
  activeModal: string;
  editMedicationInfo?: WithId<Medication>;
}

export default function Home({
  activeModal = "",
  editMedicationInfo = undefined,
}: HomeProps) {
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet | null>(null);

  useEffect(() => {
    const getPetData = async () => {
      if (userId) {
        try {
          const pet = await PetHTTPClient.getPet(userId);
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
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "add-new-medication" && <AddMedicationModal />}
      {activeModal === "edit-medication" && (
        <EditMedicationModal initialInfo={editMedicationInfo} />
      )}
      {petData ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <div className="flex h-52 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 mobile:px-2 tablet:px-4 desktop:px-8 largeDesktop:px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
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
          <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/2 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
            <div className="relative w-full h-full">
              <Image
                src={characterImages[petData.petType]}
                alt="pet"
                width={characterImages[petData.petType].width}
                height={characterImages[petData.petType].height}
                draggable={false}
                unoptimized={true}
                className="select-none mobile:h-[30%] tablet:h-[55%] desktop:h-[75%] largeDesktop:h-full w-auto object-contain"
              />
              <div className="absolute mobile:bottom-[90%] left-[90%] tablet:bottom-[75%]">
                <Bubble />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
