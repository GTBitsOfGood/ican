import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileHeader from "@/components/home/ProfileHeader";
import PetDisplay from "@/components/home/PetDisplay";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ForgotPinModal from "@/components/modals/ForgotPinModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import { useFeedPet, usePet } from "@/components/hooks/usePet";
import { Pet } from "@/types/pet";
import { WithId } from "@/types/models";
import FoodModal from "@/components/modals/FoodModal";
import { useFood } from "@/components/FoodContext";
import LevelUpModal from "@/components/modals/LevelUpModal";
import { useState, useEffect } from "react";
import { useTutorial } from "@/components/TutorialContext";
import {
  useTutorialStatus,
  useUpdateTutorialStatus,
} from "@/components/hooks/useAuth";
import { useUser } from "@/components/UserContext";
import { TUTORIAL_PORTIONS, TUTORIAL_STORAGE_KEYS } from "@/constants/tutorial";

interface HomeProps {
  activeModal: string;
  foods?: string[];
}

export default function Home({
  activeModal = "",
  foods = undefined,
}: HomeProps) {
  const { userId } = useUser();
  const { data: tutorialCompleted } = useTutorialStatus(userId);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const isTutorial = !tutorialCompleted;

  const realPetData = usePet();
  const realFeedPet = useFeedPet();
  const tutorial = useTutorial();

  const pet = isTutorial ? tutorial.pet : realPetData.data;
  const feedPetMutation = isTutorial
    ? {
        mutate: (
          _petId: string,
          options?: {
            onSuccess?: (updatedPet: WithId<Pet>) => void;
            onError?: (error: Error) => void;
          },
        ) => tutorial.feedPet(options?.onSuccess, options?.onError),
        isPending: false,
      }
    : realFeedPet;

  const [showLevelUpModalVisible, setShowLevelUpModalVisible] =
    useState<boolean>(false);
  const [showSuccessModalVisible, setShowSuccessModalVisible] =
    useState<boolean>(false);
  const { selectedFood, setSelectedFood } = useFood();
  const [distance, setDistance] = useState<number | null>(null);
  const feeding = feedPetMutation.isPending;

  useEffect(() => {
    if (!isTutorial) return;
    if (tutorial.tutorialPortion !== TUTORIAL_PORTIONS.FEED_TUTORIAL) return;
    if (tutorial.tutorialStep !== 0) return;
    if (!selectedFood) return;

    tutorial.advanceToPortion(TUTORIAL_PORTIONS.FEED_TUTORIAL);
  }, [isTutorial, tutorial, selectedFood]);

  const handleFoodDrop = async () => {
    if (!pet) return;
    if (distance == null || distance > 150) return;
    if (feeding) return;

    const previousLevel = pet.xpLevel ?? 0;

    feedPetMutation.mutate(pet._id, {
      onSuccess: (updatedPetData) => {
        const newLevel = updatedPetData?.xpLevel ?? 0;
        if (updatedPetData && newLevel > previousLevel) {
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

  const handleDrag = (dist: number | null) => {
    setDistance(dist);
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
          setVisible={setShowLevelUpModalVisible}
          level={pet?.xpLevel}
          xp={pet?.xpGained}
          levelChanged={false}
        />
      )}
      {pet ? (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            {/* Profile */}
            <ProfileHeader
              petType={pet.petType}
              level={pet.xpLevel}
              coins={pet.coins}
              currentExp={pet.xpGained}
            />
            {/* Side Bar */}
            <div className="flex flex-col gap-9 w-fit 4xl:gap-12 justify-center pt-3 px-2 4xl:px-6">
              <NavButton buttonType="settings" drawButton={false} />
              <NavButton
                buttonType="help"
                drawButton={false}
                redirect=""
                onClick={() => {
                  if (userId) {
                    localStorage.removeItem(
                      TUTORIAL_STORAGE_KEYS.CURRENT_PORTION,
                    );
                    updateTutorialStatus.mutate(
                      {
                        userId,
                        tutorial_completed: false,
                      },
                      {
                        onSuccess: () => {
                          window.location.reload();
                        },
                      },
                    );
                  }
                }}
              />
            </div>
          </div>
          {/* Navbar - VH Scaling */}
          <Navbar>
            <NavButton
              buttonType="store"
              enlarged={isTutorial && tutorial.shouldEnlargeButton("store")}
            />
            <NavButton buttonType="bag" />
            <NavButton
              buttonType="log"
              enlarged={isTutorial && tutorial.shouldEnlargeButton("log")}
            />
            {pet.food > 0 && <FeedButton />}
          </Navbar>

          {/* Character, speech bubble and food image is made relative to the image */}
          <PetDisplay
            petType={pet.petType}
            appearance={pet.appearance}
            selectedFood={selectedFood}
            bubbleText={isTutorial ? tutorial.getTutorialText() : undefined}
            onFoodDrop={handleFoodDrop}
            onDrag={handleDrag}
          />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
