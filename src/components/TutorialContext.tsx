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
import { TutorialState } from "@/types/user";

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
  completeTutorialMedicationStep: (
    medicationType?: "Pill" | "Syrup" | "Shot",
  ) => void;
  markFoodPurchased: () => void;
  markMedicationDragComplete: () => void;
  markPetFed: () => void;
  purchaseReplayFood: (foodName: string, cost: number) => void;
  consumeReplayFood: (foodName: string) => void;
  startReplay: () => void;
  isStartingReplay: boolean;
}

const getStateRank = (tutorialState: TutorialState): number => {
  switch (tutorialState) {
    case "food":
      return 0;
    case "medication":
      return 1;
    case "feed":
      return 2;
    case "complete":
      return 3;
  }
};

const getProgressState = (progress: {
  hasPurchasedFood: boolean;
  hasTakenTutorialMedication: boolean;
  hasFedPet: boolean;
}): TutorialState => {
  if (progress.hasFedPet) {
    return "complete";
  }

  if (progress.hasTakenTutorialMedication) {
    return "feed";
  }

  if (progress.hasPurchasedFood) {
    return "medication";
  }

  return "food";
};

const getPortionForState = (tutorialState: TutorialState): number => {
  switch (tutorialState) {
    case "food":
      return TUTORIAL_PORTIONS.FOOD_TUTORIAL;
    case "medication":
      return TUTORIAL_PORTIONS.LOG_TUTORIAL;
    case "feed":
      return TUTORIAL_PORTIONS.FEED_TUTORIAL;
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

const createReplaySession = (tutorialState: TutorialState): ReplaySession => {
  if (tutorialState === "food") {
    return {
      replayCoins: 100,
      replayXpLevel: 0,
      replayXpGained: 0,
      replayFoods: [],
    };
  }

  if (tutorialState === "medication" || tutorialState === "feed") {
    return {
      replayCoins: 100,
      replayXpLevel: 0,
      replayXpGained: 0,
      replayFoods: [],
    };
  }

  return {
    replayCoins: 100,
    replayXpLevel: 0,
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
  const [shouldShowMedicationDrag, setShouldShowMedicationDrag] =
    useState(false);
  const [completionTriggered, setCompletionTriggered] = useState(false);
  const [replaySession, setReplaySession] = useState<ReplaySession | null>(
    null,
  );
  const previousStatusKeyRef = useRef<string | null>(null);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const setupTutorialMedication = useSetupTutorialMedication();
  const resetTutorial = useResetTutorial();

  const shouldHoldFinalScreen = completionTriggered;
  const isPersistedActive =
    tutorialStatusLoaded && tutorialStatus.tutorialMode !== null;
  const isActive = isPersistedActive || shouldHoldFinalScreen;
  const isReplay = tutorialStatus?.tutorialMode === "replay";
  const tutorialState = tutorialStatus?.tutorialState ?? "food";
  const portion = shouldHoldFinalScreen
    ? TUTORIAL_PORTIONS.END_TUTORIAL
    : getPortionForState(tutorialState);

  useEffect(() => {
    if (!tutorialStatusLoaded || !tutorialStatus) {
      return;
    }

    if (completionTriggered && tutorialStatus.tutorialMode === null) {
      return;
    }

    const statusKey = [
      tutorialStatus.tutorialMode ?? "none",
      tutorialStatus.tutorialState,
      tutorialStatus.tutorialStep,
      tutorialStatus.tutorialMedicationType ?? "none",
      tutorialStatus.tutorialShouldShowMedicationDrag ? "drag" : "nodrag",
    ].join(":");
    if (previousStatusKeyRef.current === statusKey) {
      return;
    }

    previousStatusKeyRef.current = statusKey;
    setTutorialStep(tutorialStatus.tutorialStep);
    setCompletionTriggered(false);
    setMedicationType(tutorialStatus.tutorialMedicationType);
    setShouldShowMedicationDrag(
      tutorialStatus.tutorialShouldShowMedicationDrag,
    );
    setPracticeDose(null);

    if (tutorialStatus.tutorialMode === "replay") {
      setReplaySession((current) => {
        if (current) {
          return current;
        }

        return createReplaySession(tutorialStatus.tutorialState);
      });
      return;
    }

    setReplaySession(null);
  }, [completionTriggered, tutorialStatus, tutorialStatusLoaded]);

  const isInitialTutorial =
    tutorialStatusLoaded && tutorialStatus.tutorialMode === "initial";

  const { data: tutorialProgress } = useTutorialProgress(
    isInitialTutorial && tutorialState !== "complete",
  );

  useEffect(() => {
    if (
      !userId ||
      !tutorialStatusLoaded ||
      !tutorialStatus ||
      tutorialStatus.tutorialMode !== "initial" ||
      !tutorialProgress ||
      updateTutorialStatus.isPending
    ) {
      return;
    }

    const targetState = getProgressState(tutorialProgress);
    if (
      getStateRank(targetState) <= getStateRank(tutorialStatus.tutorialState)
    ) {
      return;
    }

    updateTutorialStatus.mutate({
      userId,
      tutorialState: targetState,
      tutorialMode: "initial",
      tutorialStep: 0,
      tutorialMedicationType: null,
      tutorialShouldShowMedicationDrag: false,
    });
  }, [
    tutorialProgress,
    tutorialStatus,
    tutorialStatusLoaded,
    updateTutorialStatus,
    userId,
  ]);

  useEffect(() => {
    if (
      !isActive ||
      tutorialState !== "medication" ||
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
    practiceDose,
    setupTutorialMedication,
    shouldShowMedicationDrag,
    tutorialState,
  ]);

  useEffect(() => {
    if (!isActive) {
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
              updateTutorialStatus.mutate(
                {
                  userId,
                  tutorialState: "complete",
                  tutorialMode: null,
                  tutorialStep,
                  tutorialMedicationType: medicationType,
                  tutorialShouldShowMedicationDrag: shouldShowMedicationDrag,
                },
                {
                  onSuccess: () => {
                    setReplaySession(null);
                    window.location.assign("/");
                  },
                  onError: () => setCompletionTriggered(false),
                },
              );
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
            tutorialCompleted: true,
            tutorialState: "complete",
            tutorialMode: null,
            tutorialStep,
            tutorialMedicationType: medicationType,
            tutorialShouldShowMedicationDrag: shouldShowMedicationDrag,
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

      if (!userId || !tutorialStatus?.tutorialMode) {
        return;
      }

      updateTutorialStatus.mutate({
        userId,
        tutorialState,
        tutorialMode: tutorialStatus.tutorialMode,
        tutorialStep: persistedStep,
        tutorialMedicationType: medicationType,
        tutorialShouldShowMedicationDrag: shouldShowMedicationDrag,
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    completionTriggered,
    isActive,
    isReplay,
    portion,
    medicationType,
    resetTutorial,
    shouldShowMedicationDrag,
    tutorialState,
    tutorialStep,
    tutorialStatus?.tutorialMode,
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
      if (!isActive || tutorialState !== "medication") {
        return;
      }

      setMedicationType(nextMedicationType);
      setShouldShowMedicationDrag(true);
      setTutorialStep(0);

      if (!userId || !tutorialStatus?.tutorialMode) {
        return;
      }

      updateTutorialStatus.mutate({
        userId,
        tutorialState: "medication",
        tutorialMode: tutorialStatus.tutorialMode,
        tutorialStep: 0,
        tutorialMedicationType: nextMedicationType,
        tutorialShouldShowMedicationDrag: true,
      });
    },
    [isActive, tutorialState, tutorialStatus, updateTutorialStatus, userId],
  );

  const markFoodPurchased = useCallback(() => {
    if (!isActive || !userId || tutorialState !== "food") {
      return;
    }

    const nextMode = isReplay ? "replay" : "initial";

    if (isReplay) {
      updateTutorialStatus.mutate({
        userId,
        tutorialState: "medication",
        tutorialMode: nextMode,
        tutorialStep: 0,
        tutorialMedicationType: null,
        tutorialShouldShowMedicationDrag: false,
      });
      return;
    }

    if (setupTutorialMedication.isPending) {
      return;
    }

    setupTutorialMedication.mutate(undefined, {
      onSuccess: (tutorialMedication) => {
        setPracticeDose(tutorialMedication);
        updateTutorialStatus.mutate({
          userId,
          tutorialState: "medication",
          tutorialMode: "initial",
          tutorialStep: 0,
          tutorialMedicationType: null,
          tutorialShouldShowMedicationDrag: false,
        });
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to prepare the tutorial practice dose.",
        );
      },
    });
  }, [
    isActive,
    isReplay,
    setupTutorialMedication,
    tutorialState,
    updateTutorialStatus,
    userId,
  ]);

  const markMedicationDragComplete = useCallback(() => {
    if (
      !isActive ||
      !userId ||
      tutorialState !== "medication" ||
      !shouldShowMedicationDrag
    ) {
      return;
    }

    setPracticeDose(null);
    setMedicationType(null);
    setShouldShowMedicationDrag(false);
    updateTutorialStatus.mutate({
      userId,
      tutorialState: "feed",
      tutorialMode: isReplay ? "replay" : "initial",
      tutorialStep: 0,
      tutorialMedicationType: null,
      tutorialShouldShowMedicationDrag: false,
    });
  }, [
    isActive,
    isReplay,
    shouldShowMedicationDrag,
    tutorialState,
    updateTutorialStatus,
    userId,
  ]);

  const markPetFed = useCallback(() => {
    if (!isActive || !userId || tutorialState !== "feed") {
      return;
    }

    if (isReplay) {
      setReplaySession((current) =>
        current
          ? applyReplayFeedProgress(current)
          : createReplaySession("complete"),
      );
    }

    updateTutorialStatus.mutate({
      userId,
      tutorialState: "complete",
      tutorialMode: isReplay ? "replay" : "initial",
      tutorialStep: 0,
      tutorialMedicationType: null,
      tutorialShouldShowMedicationDrag: false,
    });
  }, [isActive, isReplay, tutorialState, updateTutorialStatus, userId]);

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
      updateTutorialStatus.mutate(
        {
          userId,
          tutorialState: "food",
          tutorialMode: "replay",
          tutorialStep: 0,
          tutorialMedicationType: null,
          tutorialShouldShowMedicationDrag: false,
        },
        {
          onSuccess: () => window.location.assign("/"),
        },
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset tutorial progress.",
      );
    }
  }, [resetTutorial, updateTutorialStatus, userId]);

  const getTutorialText = useCallback(() => {
    if (shouldShowMedicationDrag) {
      return "Feed me the medicine!";
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
    tutorialStep,
    userProfile?.name,
  ]);

  const value = useMemo(
    () => ({
      isActive,
      isReplay,
      replayCoins: replaySession?.replayCoins ?? null,
      replayXpLevel: replaySession?.replayXpLevel ?? 0,
      replayXpGained: replaySession?.replayXpGained ?? 0,
      replayFoods: replaySession?.replayFoods ?? [],
      practiceDose,
      tutorialPortion: portion,
      tutorialStep,
      getTutorialText,
      shouldEnlargeButton,
      medicationType,
      shouldShowMedicationDrag,
      completeTutorialMedicationStep,
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
      portion,
      practiceDose,
      purchaseReplayFood,
      replaySession,
      resetTutorial.isPending,
      shouldEnlargeButton,
      shouldShowMedicationDrag,
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
