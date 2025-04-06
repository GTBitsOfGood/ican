import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import { usePet } from "@/components/petContext";
import PetAppearance from "@/components/inventory/PetAppearance";
import { PetType } from "@/types/pet";
import FoodModal from "@/components/modals/FoodModal";
import { useFood } from "@/components/FoodContext";
import LevelUpModal from "@/components/modals/LevelUpModal";
// import { useUser } from "@/components/UserContext";
import { useState } from "react";
import Image from "next/image";

interface HomeProps {
  activeModal: string;
}

// TODO: resolve all comments

export default function Home({ activeModal = "" }: HomeProps) {
  const { pet } = usePet();
  //   const { userId } = useUser();
  const [showLevelUpModalVisible, setShowLevelUpModalVisible] =
    useState<boolean>(false);
  const { selectedFood } = useFood();

  //   const handleFoodDragOver = (e: React.DragEvent<HTMLImageElement>) => {
  //     e.preventDefault();
  //   };

  //   const handleFoodDrop = async (e: React.DragEvent<HTMLImageElement>) => {
  //     e.preventDefault();
  //     try {
  //       const response = await fetch(`/api/v1/pet/${pet?._id}/feed`, {
  //         method: "PATCH",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //         },
  //       });
  //       if (!response.ok && response.status !== 200) {
  //         throw new Error("Failed to update pet data");
  //       }
  //       const updatedPetData = await response.json();
  //       if (pet && updatedPetData.xpLevel > pet.xpLevel) {
  //         setShowLevelUpModalVisible(true);
  //       }
  //       setPet(updatedPetData);
  //       setSelectedFood("");
  //     } catch (e) {
  //       console.error("Error handling food drop:", e);
  //     }
  //   };

  return (
    <AuthorizedRoute>
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "food" && <FoodModal />}
      {showLevelUpModalVisible && (
        <LevelUpModal setVisible={setShowLevelUpModalVisible} />
      )}
      {pet ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <div className="flex h-52 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 mobile:px-2 tablet:px-4 desktop:px-8 largeDesktop:px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
              <ProfilePicture character={pet.petType} />
              <ProfileInfo
                name={pet.name}
                level={pet.xpLevel}
                coins={pet.coins}
                currentExp={pet.xpGained}
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
            <NavButton buttonType="bag" />
            <NavButton buttonType="log" />
            <FeedButton />
          </Navbar>

          {/* Character, speech bubble and food image is made relative to the image */}
          <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/2 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
            <div className="relative w-full">
              <PetAppearance
                appearance={pet.appearance}
                petType={pet.petType as PetType}
                selectedItem={null}
                className="short:w-[300px] minimized:w-[270px] tiny:w-[240px] largeDesktop:w-[350px] desktop:w-[330px] tablet:w-[300px]"
                // TODO: merge this, from shivani
                // <div className="relative w-full h-full">
                //   <Image
                //     src={characterImages[pet.petType]}
                //     alt="pet"
                //     width={characterImages[pet.petType].width}
                //     height={characterImages[pet.petType].height}
                //     draggable={false}
                //     unoptimized={true}
                //     onDragOver={handleFoodDragOver}
                //     onDrop={handleFoodDrop}
                //     className="select-none mobile:h-[30%] tablet:h-[55%] desktop:h-[75%] largeDesktop:h-full w-auto object-contain"
              />
              <div className="absolute bottom-[90%] left-[90%] tablet:bottom-[75%]">
                <Bubble />
              </div>
              {selectedFood && (
                <Image
                  src={`/foods/${selectedFood}.svg`}
                  alt={selectedFood}
                  width={150}
                  height={150}
                  className="absolute bottom-[25%] right-[-50%] hover:cursor-pointer"
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
