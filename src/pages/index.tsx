import FeedButton from "@/components/ui/FeedButton";
import Navbar from "@/components/ui/Navbar";
import NavButton from "@/components/ui/NavButton";
import ProfileHeader from "@/components/home/ProfileHeader";
import PetDisplay from "@/components/home/PetDisplay";
import Hearts from "@/components/ui/Heart";
import TutorialOverlay from "@/components/ui/TutorialOverlay";

import SettingsModal from "@/components/modals/SettingsModal";
import ChangePinModal from "@/components/modals/ChangePinModal";
import ForgotPinModal from "@/components/modals/ForgotPinModal";
import ChangeChildLoginModal from "@/components/modals/ChangeChildLoginModal";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import LoadingScreen from "@/components/loadingScreen";
import { useFeedPet, usePet } from "@/components/hooks/usePet";
import { useSettings } from "@/components/hooks/useSettings";
import FoodModal from "@/components/modals/FoodModal";
import { useFood } from "@/components/FoodContext";
import LevelUpModal from "@/components/modals/LevelUpModal";
import SuccessMedicationLogModal from "@/components/modals/SuccessMedicationLogModal";
import TutorialRewardOverlay from "@/components/modals/TutorialRewardOverlay";
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
  foodCount?: number;
}

export default function Home({
  activeModal = "",
  foods = undefined,
  foodCount = undefined,
}: HomeProps) {
  const currentDate = new Date();
  const currentDateLabel = `${currentDate.toLocaleString("en-US", {
    month: "long",
  })} ${currentDate.getDate()}`;
  const router = useRouter();
  const tutorial = useTutorial();
  const isTutorial = tutorial.isActive;

  const { data: settings } = useSettings();
  const use24HourTime =
    settings?.notificationPreferences?.use24HourTime ?? false;
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
        : Math.max(pet.xpLevel ?? 1, 1)
      : Math.max(pet?.xpLevel ?? 1, 1);
  const displayCurrentExp =
    pet && isTutorial
      ? tutorial.isReplay
        ? tutorial.replayXpGained
        : (pet.xpGained ?? 0)
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
  const [showTutorialFoodRewardModal, setShowTutorialFoodRewardModal] =
    useState<boolean>(false);
  const [showNormalFoodRewardModal, setShowNormalFoodRewardModal] =
    useState<boolean>(false);
  const hasHandledMedicationRewardQueryRef = useRef(false);
  const [normalFeedPromptActive, setNormalFeedPromptActive] =
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
  const medicationRewardType =
    router.query.medicationReward === "true" &&
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
    if (
      !isTutorial ||
      tutorial.tutorialPortion !== TUTORIAL_PORTIONS.LOG_TUTORIAL ||
      tutorial.medicationType === null ||
      tutorial.shouldShowMedicationDrag
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      tutorial.startTutorialMedicationDrag();
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [
    isTutorial,
    tutorial.medicationType,
    tutorial.shouldShowMedicationDrag,
    tutorial.tutorialPortion,
    tutorial.startTutorialMedicationDrag,
  ]);

  useEffect(() => {
    if (!medicationRewardType) {
      hasHandledMedicationRewardQueryRef.current = false;
    }
  }, [medicationRewardType]);

  useEffect(() => {
    if (!completedMedicationFlow) {
      return;
    }

    const timer = window.setTimeout(() => {
      setCompletedMedicationFlow(false);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [completedMedicationFlow]);

  useEffect(() => {
    if (!normalFeedPromptActive) {
      return;
    }

    const timer = window.setTimeout(() => {
      setNormalFeedPromptActive(false);
    }, 10000);

    return () => window.clearTimeout(timer);
  }, [normalFeedPromptActive]);

  const handleFoodDrop = async (distanceOverride?: number | null) => {
    if (!pet) return;

    const finalDistance = distanceOverride ?? distance;

    if (tutorial.isReplay) {
      if (selectedFood) {
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

    if (finalDistance == null || finalDistance > 150) return;
    if (feeding) return;

    const previousLevel = pet.xpLevel ?? 0;

    feedPetMutation.mutate(pet._id, {
      onSuccess: (updatedPetData) => {
        const newLevel = updatedPetData?.xpLevel ?? 0;
        if (isTutorial) {
          tutorial.markPetFed();
        }

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
    if (normalFeedPromptActive) {
      return "I'm hungry, can you feed me some food please?";
    }
    if (completedMedicationFlow) {
      return "I feel great! Thank you for helping me, {userName}!";
    }
    if (activeMedicationFlowType && activeMedicationFlowStage === "intro") {
      return "Great job taking your medication {userName}! Now it's time for mine!";
    }
    if (activeMedicationFlowType && activeMedicationFlowStage === "drag") {
      return "Drag the medication into the correct place to medicate me!";
    }
    if (recentlyTaken) {
      return "Great job taking your medication {userName}!";
    }

    if (upcomingMed) {
      const medicationTimeLabel = upcomingMed.includeTimes
        ? formatMedicationTime(upcomingMed.scheduledDoseTime, use24HourTime)
        : currentDateLabel;
      return `Hi, {userName}!\nIt's time to take your ${medicationTimeLabel} medication.\nClick {logButton} to check-in!`;
    }

    return "Hi {userName}!";
  };

  const getBubbleAnimation = () => {
    if (normalFeedPromptActive) return "none" as const;
    if (completedMedicationFlow) return "none" as const;
    if (activeMedicationFlowType) return "none" as const;
    if (isTutorial) return "none" as const;
    if (hasMedication && !recentlyTaken) return "jump" as const;
    return "none" as const;
  };

  const handleMedicationDrag = (dist: number | null) => {
    setMedicationDistance(dist);
  };

  const handleMedicationDrop = async (distanceOverride?: number | null) => {
    if (!pet) return;

    const finalDistance = distanceOverride ?? medicationDistance;

    if (isTutorial) {
      setCompletedMedicationFlow(true);
      setMedicationDistance(null);
      setHearts(true);
      window.setTimeout(() => {
        setHearts(false);
        setShowTutorialFoodRewardModal(true);
      }, 2000);
      return;
    }

    if (finalDistance == null || finalDistance > 150) return;

    if (!activeMedicationFlowType) return;

    router.replace("/", undefined, { shallow: true });
    setCompletedMedicationFlow(true);
    setMedicationDistance(null);
    setHearts(true);
    window.setTimeout(() => {
      setHearts(false);
      setShowNormalFoodRewardModal(true);
    }, 2000);
  };

  return (
    <AuthorizedRoute>
      {activeModal === "settings" && <SettingsModal />}
      {activeModal === "change-pin" && <ChangePinModal />}
      {activeModal === "change-child-login" && <ChangeChildLoginModal />}
      {activeModal === "forgot-pin" && <ForgotPinModal />}
      {activeModal === "food" && foods && (
        <FoodModal foods={foods} foodCount={foodCount} />
      )}
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
          setVisible={setShowSuccessModalVisible}
          level={displayLevel}
          xp={displayCurrentExp}
          levelChanged={false}
        />
      )}
      {medicationRewardType && (
        <TutorialRewardOverlay
          medicationType={medicationRewardType}
          onDismiss={() => {
            hasHandledMedicationRewardQueryRef.current = true;
            router.replace(
              {
                pathname: "/",
                query: {
                  medicationFlow: "true",
                  medicationType: medicationRewardType,
                  medicationStage: "intro",
                },
              },
              undefined,
              { shallow: true },
            );
          }}
        />
      )}
      {tutorial.pendingMedicationRewardType && (
        <TutorialRewardOverlay
          medicationType={tutorial.pendingMedicationRewardType}
          onDismiss={() => {
            const medicationType = tutorial.pendingMedicationRewardType;
            if (medicationType) {
              tutorial.completeTutorialMedicationStep(medicationType);
            }
            tutorial.clearTutorialMedicationReward();
          }}
        />
      )}
      {showTutorialFoodRewardModal && (
        <SuccessMedicationLogModal
          imageSrc="/foods/pizza.svg"
          imageAlt="Food reward"
          message="You have gained food to feed your pet!"
          onModalClose={() => {
            setShowTutorialFoodRewardModal(false);
            setCompletedMedicationFlow(false);
            tutorial.markMedicationDragComplete();
          }}
        />
      )}
      {showNormalFoodRewardModal && (
        <SuccessMedicationLogModal
          imageSrc="/foods/pizza.svg"
          imageAlt="Food reward"
          message="Congratulations! You have earned food to feed your pet!"
          onModalClose={() => {
            setShowNormalFoodRewardModal(false);
            setCompletedMedicationFlow(false);
            setNormalFeedPromptActive(true);
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
                disabled={isTutorial}
              />
              <NavButton buttonType="settings" drawButton={false} />
            </div>
          </div>
          {/* Navbar - VH Scaling */}
          <Navbar>
            <NavButton buttonType="games" disabled={isTutorial} />
            <NavButton
              buttonType="store"
              enlarged={isTutorial && tutorial.shouldEnlargeButton("store")}
              disabled={isTutorial && !tutorial.shouldEnlargeButton("store")}
            />
            <NavButton buttonType="bag" disabled={isTutorial} />
            <NavButton
              buttonType="log"
              enlarged={isTutorial && tutorial.shouldEnlargeButton("log")}
              disabled={isTutorial && !tutorial.shouldEnlargeButton("log")}
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
                ? tutorial.shouldShowMedicationDrag && !completedMedicationFlow
                : !!activeMedicationFlowType
            }
            onMedicationDrop={handleMedicationDrop}
            onMedicationDrag={handleMedicationDrag}
          />

          {showHearts && <Hearts />}
          <TutorialOverlay />
        </div>
      ) : (
        <LoadingScreen />
      )}
    </AuthorizedRoute>
  );
}
