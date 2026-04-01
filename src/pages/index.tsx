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
import SuccessMedicationLogModal from "@/components/modals/SuccessMedicationLogModal";
import { useState, useEffect, useRef } from "react";
import { useTutorial } from "@/components/TutorialContext";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";
import storeItems from "@/lib/storeItems";
import { useEnsureStarterKit } from "@/components/hooks/useTutorial";
import { useUpcomingMedication } from "@/components/hooks/useMedication";
import { usePetEmotion } from "@/components/hooks/usePetEmotion";
import { formatMedicationTime } from "@/utils/medicationDisplay";
import { useRouter } from "next/router";
import { usePetFoods } from "@/components/hooks/useInventory";

interface HomeProps {
  activeModal: string;
  foods?: string[];
}

const TUTORIAL_XP_GAIN = 20;

export default function Home({
  activeModal = "",
  foods = undefined,
}: HomeProps) {
  const router = useRouter();
  const tutorial = useTutorial();
  const isTutorial = tutorial.isActive;
  const initialTutorialDisplayExp =
    isTutorial &&
    !tutorial.isReplay &&
    tutorial.tutorialPortion >= TUTORIAL_PORTIONS.END_TUTORIAL
      ? TUTORIAL_XP_GAIN
      : 0;

  const realPetData = usePet();
  const realFeedPet = useFeedPet();
  const ensureStarterKitMutation = useEnsureStarterKit();

  const pet = realPetData.data;
  const displayCoins =
    pet && isTutorial && tutorial.isReplay
      ? (tutorial.replayCoins ?? 100)
      : (pet?.coins ?? 0);
  const displayLevel =
    pet && isTutorial
      ? tutorial.isReplay
        ? tutorial.replayXpLevel
        : 0
      : (pet?.xpLevel ?? 0);
  const displayCurrentExp =
    pet && isTutorial
      ? tutorial.isReplay
        ? tutorial.replayXpGained
        : initialTutorialDisplayExp
      : (pet?.xpGained ?? 0);
  const feedPetMutation = realFeedPet;
  const { data: tutorialBagFoods = [] } = usePetFoods(
    pet && isTutorial && !tutorial.isReplay ? pet._id : undefined,
  );
  const tutorialFoods = tutorial.isReplay
    ? tutorial.replayFoods
    : tutorialBagFoods;
  const petEmotion = usePetEmotion(pet?.lastFedAt);

  const [showLevelUpModalVisible, setShowLevelUpModalVisible] =
    useState<boolean>(false);
  const [showSuccessModalVisible, setShowSuccessModalVisible] =
    useState<boolean>(false);
  const [showMedicationSuccessModal, setShowMedicationSuccessModal] =
    useState<boolean>(false);
  const { selectedFood, setSelectedFood } = useFood();
  const [distance, setDistance] = useState<number | null>(null);
  const hasEnsuredStarterKit = useRef(false);
  const [showHearts, setHearts] = useState<boolean>(false);
  const [medicationDistance, setMedicationDistance] = useState<number | null>(
    null,
  );
  const feeding = feedPetMutation.isPending;
  const {
    medication: upcomingMed,
    hasMedication,
    recentlyTaken,
  } = useUpcomingMedication();
  const activeMedicationFlowType =
    router.query.medicationFlow === "true" &&
    (router.query.medicationType === "Pill" ||
      router.query.medicationType === "Syrup" ||
      router.query.medicationType === "Shot")
      ? router.query.medicationType
      : null;
  const [completedMedicationFlow, setCompletedMedicationFlow] =
    useState<boolean>(false);
  const activeMedicationFlowStage =
    activeMedicationFlowType && router.query.medicationStage === "drag"
      ? "drag"
      : activeMedicationFlowType
        ? "intro"
        : null;
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

  useEffect(() => {
    if (!activeMedicationFlowType || isTutorial) {
      return;
    }

    if (activeMedicationFlowStage !== "intro") {
      return;
    }

    const timer = window.setTimeout(() => {
      router.replace(
        {
          pathname: "/",
          query: {
            medicationFlow: "true",
            medicationType: activeMedicationFlowType,
            medicationStage: "drag",
          },
        },
        undefined,
        { shallow: true },
      );
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [activeMedicationFlowStage, activeMedicationFlowType, isTutorial, router]);

  useEffect(() => {
    if (!completedMedicationFlow) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCompletedMedicationFlow(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [completedMedicationFlow]);

  const handleFoodDrop = async () => {
    if (!pet) return;

    if (isTutorial) {
      if (tutorial.isReplay && selectedFood) {
        tutorial.consumeReplayFood(selectedFood);
      }
      tutorial.markPetFed();
      setHearts(true);
      setTimeout(() => {
        setHearts(false);
        setShowSuccessModalVisible(true);
      }, 2000);
      setSelectedFood("");
      return;
    }

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
    if (activeMedicationFlowType && activeMedicationFlowStage === "intro") {
      return "Great job taking your medication {userName}! Now it's time for mine!";
    }
    if (activeMedicationFlowType && activeMedicationFlowStage === "drag") {
      return "Drag the medication into the correct place to medicate me!";
    }
    if (completedMedicationFlow) {
      return "I feel great! Thank you for helping me, {userName}!";
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
    if (activeMedicationFlowType || completedMedicationFlow)
      return "none" as const;
    if (isTutorial) return "none" as const;
    if (hasMedication && !recentlyTaken) return "jump" as const;
    return "none" as const;
  };

  const handleMedicationDrag = (dist: number | null) => {
    setMedicationDistance(dist);
  };

  const handleMedicationDrop = async () => {
    if (!pet) return;

    if (isTutorial) {
      setShowMedicationSuccessModal(true);
      tutorial.markMedicationDragComplete();
      return;
    }

    if (medicationDistance == null || medicationDistance > 150) return;

    if (!activeMedicationFlowType) return;

    setCompletedMedicationFlow(true);
    setMedicationDistance(null);
    router.replace("/", undefined, { shallow: true });
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
          level={displayLevel}
          xp={displayCurrentExp}
          levelChanged={true}
        />
      )}
      {showSuccessModalVisible && (
        <LevelUpModal
          setVisible={setShowLevelUpModalVisible}
          level={displayLevel}
          xp={displayCurrentExp}
          levelChanged={false}
        />
      )}
      {showMedicationSuccessModal && (
        <SuccessMedicationLogModal
          onModalClose={() => {
            setShowMedicationSuccessModal(false);
          }}
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
              level={displayLevel}
              coins={displayCoins}
              currentExp={displayCurrentExp}
            />
            {/* Side Bar */}
            <div className="flex flex-row gap-4 w-fit 4xl:gap-8 justify-center p-10">
              <NavButton
                buttonType="help"
                drawButton={false}
                redirect="/help"
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
            <FeedButton
              active={
                isTutorial
                  ? tutorial.tutorialPortion ===
                      TUTORIAL_PORTIONS.FEED_TUTORIAL &&
                    tutorialFoods.length > 0
                  : pet.food > 0
              }
            />
          </Navbar>
          {/* Character, speech bubble and food image is made relative to the image */}
          <PetDisplay
            petType={pet.petType}
            appearance={pet.appearance}
            emotion={petEmotion}
            selectedFood={selectedFood}
            bubbleText={getBubbleText()}
            bubbleAnimation={getBubbleAnimation()}
            onFoodDrop={handleFoodDrop}
            onDrag={handleDrag}
            medicationType={
              isTutorial ? tutorial.medicationType : activeMedicationFlowType
            }
            shouldShowMedicationDrag={
              isTutorial
                ? tutorial.shouldShowMedicationDrag
                : !!activeMedicationFlowType
            }
            onMedicationDrop={handleMedicationDrop}
            onMedicationDrag={handleMedicationDrag}
          />

          {showHearts && <Hearts />}
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
