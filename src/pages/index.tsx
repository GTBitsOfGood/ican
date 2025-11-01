import Bubble from "@/components/ui/Bubble";
import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileInfo from "@/components/ui/ProfileInfo";
import ProfilePicture from "@/components/ui/ProfilePicture";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ForgotPinModal from "@/components/modals/ForgotPinModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import { useFeedPet, usePet } from "@/components/hooks/usePet";
import PetAppearance from "@/components/inventory/PetAppearance";
import { PetType } from "@/types/pet";
import FoodModal from "@/components/modals/FoodModal";
import { useFood } from "@/components/FoodContext";
import LevelUpModal from "@/components/modals/LevelUpModal";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface HomeProps {
  activeModal: string;
  foods?: string[];
}

export default function Home({
  activeModal = "",
  foods = undefined,
}: HomeProps) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);
  const { data: pet } = usePet();
  const feedPetMutation = useFeedPet();
  const [showLevelUpModalVisible, setShowLevelUpModalVisible] =
    useState<boolean>(false);
  const [showSuccessModalVisible, setShowSuccessModalVisible] =
    useState<boolean>(false);
  const { selectedFood, setSelectedFood } = useFood();
  const [distance, setDistance] = useState<number | null>(null);
  const feeding = feedPetMutation.isPending;
  const [bubbleText, setBubbleText] = useState<string>(
    "I’m hungry, can you feed me some food, please?",
  );

  const getDistanceMessage = (distance: number | null) => {
    if (distance === null || distance > 150) {
      return "Drag the food into my mouth to feed me!";
    }
    return "Yummy! Thank you for feeding me, Michelle!";
  };

  useEffect(() => {
    if (selectedFood && distance != null) {
      setBubbleText(getDistanceMessage(distance));
    } else if (selectedFood) {
      setBubbleText("Drag the food into my mouth to feed me!");
    } else {
      setBubbleText("I’m hungry, can you feed me some food, please?");
    }
  }, [distance, selectedFood]);

  const handleFoodDrop = async () => {
    if (!pet) return;
    if (distance == null || distance > 150) {
      return;
    }
    if (feeding) return;

    const previousLevel = pet.xpLevel;

    feedPetMutation.mutate(pet._id, {
      onSuccess: (updatedPetData) => {
        if (updatedPetData && updatedPetData.xpLevel > previousLevel) {
          setShowLevelUpModalVisible(true);
        } else {
          setShowSuccessModalVisible(true);
        }
        setSelectedFood("");
      },
      onError: (error) => {
        console.error("Error handling food drop:", error);
      },
    });
  };

  return (
    <AuthorizedRoute>
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "forgot-pin" && <ForgotPinModal />}
      {activeModal === "food" && foods && <FoodModal foods={foods} />}
      {showLevelUpModalVisible && (
        <LevelUpModal
          setVisible={setShowLevelUpModalVisible}
          level={pet?.xpLevel}
          xp={pet?.xpGained}
          levelChanged={true}
        />
      )}
      {showSuccessModalVisible && (
        <LevelUpModal
          setVisible={setShowSuccessModalVisible}
          level={pet?.xpLevel}
          xp={pet?.xpGained}
          levelChanged={false}
        />
      )}
      {pet ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <div className="flex h-52 w-fit py-8 bg-[#2c3694] justify-start items-center gap-10 mobile:px-2 tablet:px-4 desktop:px-8 largeDesktop:px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
              <ProfilePicture character={pet.petType} />
              <ProfileInfo
                // name={pet.name}
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
            {pet.food >= 0 && <FeedButton />}
          </Navbar>

          {/* Character, speech bubble and food image is made relative to the image */}
          <div className="fixed mobile:left-[25%] mobile:top-[75%] tablet:left-1/2 tablet:top-[60%] transform -translate-x-1/2 -translate-y-1/2 h-[45%] max-h-[40rem] w-fit">
            <div className="relative w-full">
              <PetAppearance
                appearance={pet.appearance}
                petType={pet.petType as PetType}
                selectedItem={null}
                className="short:w-[300px] minimized:w-[270px] tiny:w-[240px] largeDesktop:w-[350px] desktop:w-[330px] tablet:w-[300px]"
              />
              <div className="absolute bottom-[90%] left-[90%] tablet:bottom-[75%]">
                <Bubble text={bubbleText} />
              </div>
              <div
                ref={constraintsRef}
                className="absolute bottom-[30%] -right-[45%] rotate-12 w-[275px] h-[100px]"
              ></div>
              {selectedFood && (
                <motion.div
                  drag
                  dragConstraints={constraintsRef}
                  ref={foodRef}
                  dragElastic={0.1}
                  dragMomentum={false}
                  whileTap={{ cursor: "grabbing" }}
                  className="absolute bottom-[25%] right-[-50%] z-[25]"
                  style={{
                    width: 150,
                    height: 150,
                    cursor: "grab",
                  }}
                  onDrag={() => {
                    if (constraintsRef.current) {
                      const constraintsRect =
                        constraintsRef?.current?.getBoundingClientRect();
                      const foodRect =
                        foodRef?.current?.getBoundingClientRect();
                      if (constraintsRect && foodRect) {
                        const foodCenterX = foodRect.left + foodRect.width / 2;
                        const distanceFromLeft =
                          foodCenterX - constraintsRect.left;
                        setDistance(distanceFromLeft);
                      }
                    }
                  }}
                  onMouseUp={handleFoodDrop}
                  onMouseLeave={handleFoodDrop}
                >
                  <Image
                    src={`/foods/${selectedFood}.svg`}
                    alt={selectedFood}
                    width={150}
                    height={150}
                    style={{ pointerEvents: "none" }}
                  />
                </motion.div>
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
