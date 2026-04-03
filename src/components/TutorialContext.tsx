import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { usePet } from "./hooks/usePet";
import {
  useTutorialStatus,
  useUpdateTutorialStatus,
  useUserProfile,
} from "./hooks/useAuth";
import { useUser } from "./UserContext";
import { TUTORIAL_DIALOGUES, TUTORIAL_PORTIONS } from "@/constants/tutorial";
import {
  TutorialMedicationSetup,
  useResetTutorial,
  useSetupTutorialMedication,
  useTutorialProgress,
} from "./hooks/useTutorial";
import { calculateXPForLevel } from "@/utils/constants";
import { InitialTutorialStage } from "@/types/user";

const TUTORIAL_REPLAY_XP_GAIN = 20;

interface ReplaySession {
  replayCoins: number;
  replayXpLevel: number;
  replayXpGained: number;
  replayFoods: string[];
}

interface TutorialContextType {
  isActive: boolean;
  isReplay: boolean;
  replayCoins: number | null;
  replayXpLevel: number;
  replayXpGained: number;
  replayFoods: string[];
  practiceDose: TutorialMedicationSetup | null;
  tutorialPortion: number;
  tutorialStep: number;
  getTutorialText: () => string | undefined;
  shouldEnlargeButton: (buttonType: "store" | "log") => boolean;
  medicationType: "Pill" | "Syrup" | "Shot" | null;
  shouldShowMedicationDrag: boolean;
  pendingMedicationRewardType: "Pill" | "Syrup" | "Shot" | null;
  completeTutorialMedicationStep: (
    medicationType?: "Pill" | "Syrup" | "Shot",
  ) => void;
  queueTutorialMedicationReward: (
    medicationType: "Pill" | "Syrup" | "Shot",
  ) => void;
  clearTutorialMedicationReward: () => void;
  startTutorialMedicationDrag: () => void;
  markFoodPurchased: () => void;
  markMedicationDragComplete: () => void;
  markPetFed: () => void;
  purchaseReplayFood: (foodName: string, cost: number) => void;
  consumeReplayFood: (foodName: string) => void;
  startReplay: () => void;
  isStartingReplay: boolean;
}

const getStateRank = (tutorialStage: InitialTutorialStage): number => {
  switch (tutorialStage) {
    case "food":
      return 0;
    case "medication":
      return 1;
    case "feed":
      return 2;
    case "end":
      return 3;
    case "complete":
      return 4;
  }
};

const getProgressStage = (progress: {
  hasPurchasedFood: boolean;
  hasTakenTutorialMedication: boolean;
  hasFedPet: boolean;
}): InitialTutorialStage => {
  if (progress.hasFedPet) {
    return "end";
  }

  if (progress.hasTakenTutorialMedication) {
    return "medication";
  }

  if (progress.hasPurchasedFood) {
    return "medication";
  }

  return "food";
};

const getPortionForStage = (tutorialStage: InitialTutorialStage): number => {
  switch (tutorialStage) {
    case "food":
      return TUTORIAL_PORTIONS.FOOD_TUTORIAL;
    case "medication":
      return TUTORIAL_PORTIONS.LOG_TUTORIAL;
    case "feed":
      return TUTORIAL_PORTIONS.FEED_TUTORIAL;
    case "end":
      return TUTORIAL_PORTIONS.END_TUTORIAL;
    case "complete":
      return TUTORIAL_PORTIONS.END_TUTORIAL;
  }
};

const applyReplayFeedProgress = (session: ReplaySession): ReplaySession => {
  const nextXp = session.replayXpGained + TUTORIAL_REPLAY_XP_GAIN;
  const threshold = calculateXPForLevel(session.replayXpLevel);

  if (nextXp >= threshold) {
    return {
      ...session,
      replayXpLevel: session.replayXpLevel + 1,
      replayXpGained: nextXp - threshold,
      replayFoods: [],
    };
  }

  return {
    ...session,
    replayXpGained: nextXp,
    replayFoods: [],
  };
};

const createReplaySession = (
  tutorialStage: InitialTutorialStage = "food",
): ReplaySession => {
  if (tutorialStage === "food") {
    return {
      replayCoins: 100,
      replayXpLevel: 1,
      replayXpGained: 0,
      replayFoods: [],
    };
  }

  if (tutorialStage === "medication" || tutorialStage === "feed") {
    return {
      replayCoins: 100,
      replayXpLevel: 1,
      replayXpGained: 0,
      replayFoods: [],
    };
  }

  return {
    replayCoins: 100,
    replayXpLevel: 1,
    replayXpGained: 0,
    replayFoods: [],
  };
};

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const { userId } = useUser();
  const { data: tutorialStatus, isSuccess: tutorialStatusLoaded } =
    useTutorialStatus(userId);
  const { data: userProfile } = useUserProfile(userId);
  const { data: realPet } = usePet();
  const [tutorialStep, setTutorialStep] = useState(0);
  const [practiceDose, setPracticeDose] =
    useState<TutorialMedicationSetup | null>(null);
  const [medicationType, setMedicationType] = useState<
    "Pill" | "Syrup" | "Shot" | null
  >(null);
  const [pendingMedicationRewardType, setPendingMedicationRewardType] =
    useState<"Pill" | "Syrup" | "Shot" | null>(null);
  const [shouldShowMedicationDrag, setShouldShowMedicationDrag] =
    useState(false);
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [replaySession, setReplaySession] = useState<ReplaySession | null>(
    null,
  );
  const [replayStage, setReplayStage] = useState<InitialTutorialStage | null>(
    null,
  );
  const previousStatusKeyRef = useRef<string | null>(null);
  const pendingInitialStageRef = useRef<InitialTutorialStage | null>(null);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const setupTutorialMedication = useSetupTutorialMedication();
  const resetTutorial = useResetTutorial();

  const initialTutorialStage = tutorialStatus?.initialTutorialStage ?? "food";
  const isReplay = replayStage !== null;
  const tutorialStage = replayStage ?? initialTutorialStage;
  const shouldHoldFinalScreen = completionTriggered;
  const isPersistedActive =
    tutorialStatusLoaded && initialTutorialStage !== "complete" && !isReplay;
  const isActive = isReplay || isPersistedActive || shouldHoldFinalScreen;
  const portion = shouldHoldFinalScreen
    ? TUTORIAL_PORTIONS.END_TUTORIAL
    : getPortionForStage(tutorialStage);

  useEffect(() => {
    if (!tutorialStatusLoaded || !tutorialStatus || isReplay) {
      return;
    }

    if (completionTriggered && tutorialStage === "complete") {
      return;
    }

    const statusKey = tutorialStatus.initialTutorialStage;
    if (previousStatusKeyRef.current === statusKey) {
      return;
    }

    previousStatusKeyRef.current = statusKey;
    const timeoutId = window.setTimeout(() => {
      setTutorialStep(0);
      setCompletionTriggered(false);
      setMedicationType(null);
      setShouldShowMedicationDrag(false);
      setPracticeDose(null);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [
    completionTriggered,
    isReplay,
    tutorialStage,
    tutorialStatus,
    tutorialStatusLoaded,
  ]);

  const isInitialTutorial =
    tutorialStatusLoaded && initialTutorialStage !== "complete" && !isReplay;

  const { data: tutorialProgress } = useTutorialProgress(isInitialTutorial);

  useEffect(() => {
    if (
      pendingInitialStageRef.current !== null &&
      tutorialStatus?.initialTutorialStage === pendingInitialStageRef.current
    ) {
      pendingInitialStageRef.current = null;
    }
  }, [tutorialStatus?.initialTutorialStage]);

  useEffect(() => {
    if (
      !userId ||
      !tutorialStatusLoaded ||
      !tutorialStatus ||
      isReplay ||
      !tutorialProgress ||
      updateTutorialStatus.isPending
    ) {
      return;
    }

    const targetStage = getProgressStage(tutorialProgress);
    if (
      getStateRank(targetStage) <=
      getStateRank(tutorialStatus.initialTutorialStage)
    ) {
      return;
    }

    if (pendingInitialStageRef.current === targetStage) {
      return;
    }

    pendingInitialStageRef.current = targetStage;
    updateTutorialStatus.mutate({
      userId,
      initialTutorialStage: targetStage,
    });
  }, [
    isReplay,
    tutorialProgress,
    tutorialStatus,
    tutorialStatusLoaded,
    updateTutorialStatus,
    userId,
  ]);

  useEffect(() => {
    if (
      !isActive ||
      tutorialStage !== "medication" ||
      medicationType !== null ||
      shouldShowMedicationDrag ||
      practiceDose ||
      setupTutorialMedication.isPending
    ) {
      return;
    }

    setupTutorialMedication.mutate(undefined, {
      onSuccess: (tutorialMedication) => {
        setPracticeDose(tutorialMedication);
      },
    });
  }, [
    isActive,
    medicationType,
    practiceDose,
    setupTutorialMedication,
    shouldShowMedicationDrag,
    tutorialStage,
  ]);

  useEffect(() => {
    if (!isActive || medicationType !== null || shouldShowMedicationDrag) {
      return;
    }

    const handleKeyPress = () => {
      const dialogues = TUTORIAL_DIALOGUES[portion];
      if (!dialogues?.length) {
        return;
      }

      const nextStep = tutorialStep + 1;
      if (
        portion === TUTORIAL_PORTIONS.END_TUTORIAL &&
        nextStep >= dialogues.length
      ) {
        if (completionTriggered || !userId) {
          return;
        }

        setCompletionTriggered(true);

        if (isReplay) {
          resetTutorial.mutate(undefined, {
            onSuccess: () => {
              setReplaySession(null);
              setReplayStage(null);
              setMedicationType(null);
              setShouldShowMedicationDrag(false);
              window.location.assign("/");
            },
            onError: (error) => {
              setCompletionTriggered(false);
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Failed to clean up tutorial replay.",
              );
            },
          });
          return;
        }

        updateTutorialStatus.mutate(
          {
            userId,
            initialTutorialStage: "complete",
          },
          {
            onSuccess: () => window.location.assign("/"),
            onError: () => setCompletionTriggered(false),
          },
        );
        return;
      }

      const persistedStep = Math.min(nextStep, dialogues.length - 1);
      setTutorialStep(persistedStep);
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    completionTriggered,
    isActive,
    isReplay,
    medicationType,
    portion,
    resetTutorial,
    shouldShowMedicationDrag,
    tutorialStage,
    tutorialStep,
    updateTutorialStatus,
    userId,
  ]);

  const shouldEnlargeButton = useCallback(
    (buttonType: "store" | "log") => {
      if (!isActive) {
        return false;
      }

      if (buttonType === "store") {
        return (
          portion === TUTORIAL_PORTIONS.FOOD_TUTORIAL &&
          tutorialStep ===
            TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.FOOD_TUTORIAL].length - 1
        );
      }

      if (buttonType === "log") {
        return (
          portion === TUTORIAL_PORTIONS.LOG_TUTORIAL &&
          tutorialStep ===
            TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.LOG_TUTORIAL].length - 1
        );
      }

      return false;
    },
    [isActive, portion, tutorialStep],
  );

  const completeTutorialMedicationStep = useCallback(
    (nextMedicationType: "Pill" | "Syrup" | "Shot" = "Pill") => {
      if (!isActive || tutorialStage !== "medication") {
        return;
      }

      setMedicationType(nextMedicationType);
      setPendingMedicationRewardType(null);
      setShouldShowMedicationDrag(true);
      setTutorialStep(0);
    },
    [isActive, tutorialStage],
  );

  const queueTutorialMedicationReward = useCallback(
    (nextMedicationType: "Pill" | "Syrup" | "Shot") => {
      if (!isActive || tutorialStage !== "medication") {
        return;
      }

      setPendingMedicationRewardType(nextMedicationType);
    },
    [isActive, tutorialStage],
  );

  const clearTutorialMedicationReward = useCallback(() => {
    setPendingMedicationRewardType(null);
  }, []);

  const startTutorialMedicationDrag = useCallback(() => {
    if (
      !isActive ||
      tutorialStage !== "medication" ||
      medicationType === null ||
      shouldShowMedicationDrag
    ) {
      return;
    }

    setShouldShowMedicationDrag(true);
  }, [isActive, medicationType, shouldShowMedicationDrag, tutorialStage]);

  const markFoodPurchased = useCallback(() => {
    if (!isActive || tutorialStage !== "food") {
      return;
    }

    if (isReplay) {
      setReplayStage("medication");
      setTutorialStep(0);
      setMedicationType(null);
      setShouldShowMedicationDrag(false);
      return;
    }

    if (!userId) {
      return;
    }

    if (pendingInitialStageRef.current === "medication") {
      return;
    }

    pendingInitialStageRef.current = "medication";
    updateTutorialStatus.mutate({
      userId,
      initialTutorialStage: "medication",
    });
  }, [isActive, isReplay, tutorialStage, updateTutorialStatus, userId]);

  const markMedicationDragComplete = useCallback(() => {
    if (
      !isActive ||
      tutorialStage !== "medication" ||
      !shouldShowMedicationDrag
    ) {
      return;
    }

    setPracticeDose(null);
    setMedicationType(null);
    setShouldShowMedicationDrag(false);
    setTutorialStep(0);

    if (isReplay) {
      setReplayStage("feed");
      return;
    }

    if (!userId) {
      return;
    }

    if (pendingInitialStageRef.current === "feed") {
      return;
    }

    pendingInitialStageRef.current = "feed";
    updateTutorialStatus.mutate({
      userId,
      initialTutorialStage: "feed",
    });
  }, [
    isActive,
    isReplay,
    shouldShowMedicationDrag,
    tutorialStage,
    updateTutorialStatus,
    userId,
  ]);

  const markPetFed = useCallback(() => {
    if (!isActive || tutorialStage !== "feed") {
      return;
    }

    if (isReplay) {
      setReplaySession((current) =>
        current ? applyReplayFeedProgress(current) : createReplaySession("end"),
      );
      setReplayStage("end");
      setTutorialStep(0);
      setMedicationType(null);
      setShouldShowMedicationDrag(false);
      return;
    }

    if (!userId) {
      return;
    }

    if (pendingInitialStageRef.current === "end") {
      return;
    }

    pendingInitialStageRef.current = "end";
    updateTutorialStatus.mutate({
      userId,
      initialTutorialStage: "end",
    });
  }, [isActive, isReplay, tutorialStage, updateTutorialStatus, userId]);

  const purchaseReplayFood = useCallback(
    (foodName: string, cost: number) => {
      if (!isReplay) {
        return;
      }

      setReplaySession((current) => {
        const activeSession = current ?? createReplaySession("food");
        if (
          activeSession.replayCoins < cost ||
          activeSession.replayFoods.includes(foodName)
        ) {
          return activeSession;
        }

        return {
          ...activeSession,
          replayCoins: activeSession.replayCoins - cost,
          replayFoods: [...activeSession.replayFoods, foodName],
        };
      });
    },
    [isReplay],
  );

  const consumeReplayFood = useCallback(
    (foodName: string) => {
      if (!isReplay) {
        return;
      }

      setReplaySession((current) => {
        const activeSession = current ?? createReplaySession("feed");
        return {
          ...activeSession,
          replayFoods: activeSession.replayFoods.filter(
            (food) => food !== foodName,
          ),
        };
      });
    },
    [isReplay],
  );

  const startReplay = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      await resetTutorial.mutateAsync(undefined);
      setReplaySession(createReplaySession("food"));
      setReplayStage("food");
      setTutorialStep(0);
      setMedicationType(null);
      setPendingMedicationRewardType(null);
      setShouldShowMedicationDrag(false);
      router.push("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset tutorial progress.",
      );
    }
  }, [resetTutorial, router, userId]);

  const getTutorialText = useCallback(() => {
    if (shouldShowMedicationDrag) {
      return "Feed me the medicine!";
    }

    if (tutorialStage === "medication" && medicationType) {
      return "Great job taking your medication {userName}! Now it's time for mine!";
    }

    const dialogues = TUTORIAL_DIALOGUES[portion];
    if (!dialogues || tutorialStep >= dialogues.length) {
      return undefined;
    }

    const userName = userProfile?.name?.trim() || "Friend";
    const petName = realPet?.name?.trim() || "Paws";

    return dialogues[tutorialStep]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  }, [
    portion,
    realPet?.name,
    shouldShowMedicationDrag,
    medicationType,
    tutorialStage,
    tutorialStep,
    userProfile?.name,
  ]);

  const value = useMemo(
    () => ({
      isActive,
      isReplay,
      replayCoins: replaySession?.replayCoins ?? null,
      replayXpLevel: replaySession?.replayXpLevel ?? 1,
      replayXpGained: replaySession?.replayXpGained ?? 0,
      replayFoods: replaySession?.replayFoods ?? [],
      practiceDose,
      tutorialPortion: portion,
      tutorialStep,
      getTutorialText,
      shouldEnlargeButton,
      medicationType,
      shouldShowMedicationDrag,
      pendingMedicationRewardType,
      completeTutorialMedicationStep,
      queueTutorialMedicationReward,
      clearTutorialMedicationReward,
      startTutorialMedicationDrag,
      markFoodPurchased,
      markMedicationDragComplete,
      markPetFed,
      purchaseReplayFood,
      consumeReplayFood,
      startReplay,
      isStartingReplay: resetTutorial.isPending,
    }),
    [
      completeTutorialMedicationStep,
      consumeReplayFood,
      getTutorialText,
      isActive,
      isReplay,
      markFoodPurchased,
      markMedicationDragComplete,
      markPetFed,
      medicationType,
      pendingMedicationRewardType,
      portion,
      practiceDose,
      purchaseReplayFood,
      replaySession,
      resetTutorial.isPending,
      shouldEnlargeButton,
      shouldShowMedicationDrag,
      queueTutorialMedicationReward,
      clearTutorialMedicationReward,
      startTutorialMedicationDrag,
      startReplay,
      tutorialStep,
    ],
  );

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error("useTutorial must be used within a TutorialProvider");
  }
  return context;
};
