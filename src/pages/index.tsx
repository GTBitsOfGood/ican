import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileHeader from "@/components/home/ProfileHeader";
import PetDisplay from "@/components/home/PetDisplay";
import Hearts from "@/components/ui/Heart";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ForgotPinModal from "@/components/modals/ForgotPinModal";
import ChangeChildLoginModal from "@/components/modals/ChangeChildLoginModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import { useFeedPet, usePet } from "@/components/hooks/usePet";
import FoodModal from "@/components/modals/FoodModal";
import { useFood } from "@/components/FoodContext";
import LevelUpModal from "@/components/modals/LevelUpModal";
import { useState, useEffect, useRef } from "react";
import { useTutorial } from "@/components/TutorialContext";
import {
  useTutorialStatus,
  useUpdateTutorialStatus,
} from "@/components/hooks/useAuth";
import { useUser } from "@/components/UserContext";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";
import storeItems from "@/lib/storeItems";
import { useEnsureStarterKit } from "@/components/hooks/useTutorial";
import { useUpcomingMedication } from "@/components/hooks/useMedication";
import { formatMedicationTime } from "@/utils/medicationDisplay";

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
  const ensureStarterKitMutation = useEnsureStarterKit();

  const pet = realPetData.data;
  const feedPetMutation = realFeedPet;

  const [showLevelUpModalVisible, setShowLevelUpModalVisible] =
    useState<boolean>(false);
  const [showSuccessModalVisible, setShowSuccessModalVisible] =
    useState<boolean>(false);
  const { selectedFood, setSelectedFood } = useFood();
  const [distance, setDistance] = useState<number | null>(null);
  const hasEnsuredStarterKit = useRef(false);
  const [showHearts, setHearts] = useState<boolean>(false);
  const feeding = feedPetMutation.isPending;
  const {
    medication: upcomingMed,
    hasMedication,
    recentlyTaken,
  } = useUpcomingMedication();
  const equippedBackgroundKey = pet?.appearance?.background;
  const equippedBackgroundFromStore =
    equippedBackgroundKey &&
    storeItems.background[equippedBackgroundKey]?.image;
  const equippedBackgroundImage =
    equippedBackgroundFromStore ||
    (equippedBackgroundKey && equippedBackgroundKey.startsWith("/")
      ? equippedBackgroundKey
      : "/bg-home.svg");

  useEffect(() => {
    if (!isTutorial) return;
    if (tutorial.tutorialPortion !== TUTORIAL_PORTIONS.FOOD_TUTORIAL) return;
    if (tutorial.tutorialStep !== 3) return;
    if (hasEnsuredStarterKit.current) return;
    hasEnsuredStarterKit.current = true;
    ensureStarterKitMutation.mutate();
  }, [
    isTutorial,
    tutorial.tutorialPortion,
    tutorial.tutorialStep,
    ensureStarterKitMutation,
  ]);

  const handleFoodDrop = async () => {
    if (!pet) return;
    if (distance == null || distance > 150) return;
    if (feeding) return;

    const previousLevel = pet.xpLevel ?? 0;

    feedPetMutation.mutate(pet._id, {
      onSuccess: (updatedPetData) => {
        const newLevel = updatedPetData?.xpLevel ?? 0;

        setHearts(true);

        if (updatedPetData && newLevel > previousLevel) {
          setTimeout(() => {
            setHearts(false);
            setShowLevelUpModalVisible(true);
          }, 2000);
        } else {
          // Hearts will trigger success modal after animation
          setTimeout(() => {
            setHearts(false);
            setShowSuccessModalVisible(true);
          }, 2000);
        }

        setSelectedFood("");
        if (isTutorial) {
          tutorial.advanceToPortion(TUTORIAL_PORTIONS.END_TUTORIAL);
        }
      },
      onError: (error) => {
        console.error("Error handling food drop:", error);
      },
    });
  };

  const handleDrag = (dist: number | null) => {
    setDistance(dist);
  };

  const getBubbleText = () => {
    if (isTutorial) {
      return tutorial.getTutorialText();
    }
    if (recentlyTaken) {
      return "Great job taking your medication {userName}!";
    }

    if (upcomingMed) {
      const formattedTime = formatMedicationTime(upcomingMed.scheduledDoseTime);
      return `Hi, {userName}!\nIt's time to take your ${formattedTime} medication.\nClick {logButton} to check-in!`;
    }

    return "Hi {userName}!";
  };

  const getBubbleAnimation = () => {
    if (isTutorial) return "none" as const;
    if (hasMedication && !recentlyTaken) return "jump" as const;
    return "none" as const;
  };

  return (
    <AuthorizedRoute>
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "change-child-login" && <ChangeChildLoginModal />}
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
          <div
            className="flex-1 flex flex-row justify-between bg-no-repeat"
            style={{
              backgroundImage: `url("${equippedBackgroundImage}")`,
              backgroundSize: "cover",
              backgroundPosition: "center bottom",
            }}
          >
            {/* Profile */}
            <ProfileHeader
              petType={pet.petType}
              level={pet.xpLevel}
              coins={pet.coins}
              currentExp={pet.xpGained}
            />
            {/* Side Bar */}
            <div className="flex flex-row gap-4 w-fit 4xl:gap-8 justify-center p-10">
              <NavButton
                buttonType="help"
                drawButton={false}
                redirect=""
                onClick={() => {
                  if (userId) {
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
              <NavButton buttonType="settings" drawButton={false} />
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
            <FeedButton active={pet.food > 0} />
          </Navbar>
          {/* Character, speech bubble and food image is made relative to the image */}
          <PetDisplay
            petType={pet.petType}
            appearance={pet.appearance}
            selectedFood={selectedFood}
            bubbleText={getBubbleText()}
            bubbleAnimation={getBubbleAnimation()}
            onFoodDrop={handleFoodDrop}
            onDrag={handleDrag}
          />

          {showHearts && <Hearts />}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
