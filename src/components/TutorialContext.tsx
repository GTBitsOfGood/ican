import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
import { Pet } from "@/types/pet";
import { calculateXPForLevel } from "@/utils/constants";

const TUTORIAL_REPLAY_XP_GAIN = 20;

type ReplayPetSnapshot = Pick<
  Pet,
  "coins" | "xpGained" | "xpLevel" | "food" | "lastFedAt"
>;

interface TutorialSession {
  active: boolean;
  replay: boolean;
  originalCoins: number | null;
  originalPetState: ReplayPetSnapshot | null;
  replayCoins: number | null;
  replayXpLevel: number;
  replayXpGained: number;
  replayFoods: string[];
  practiceDose: TutorialMedicationSetup | null;
  portion: number;
  step: number;
  medicationType: "Pill" | "Syrup" | "Shot" | null;
  shouldShowMedicationDrag: boolean;
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

const STORAGE_KEY = "tutorial-session-v1";
const SUPPRESS_AUTO_START_KEY = "tutorial-suppress-auto-start";

const createDefaultSession = (
  replay: boolean,
  originalCoins: number | null = null,
  originalPetState: ReplayPetSnapshot | null = null,
  replayCoins: number | null = null,
): TutorialSession => ({
  active: true,
  replay,
  originalCoins,
  originalPetState,
  replayCoins,
  replayXpLevel: 0,
  replayXpGained: 0,
  replayFoods: [],
  practiceDose: null,
  portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  step: 0,
  medicationType: null,
  shouldShowMedicationDrag: false,
});

const readStoredSession = (): TutorialSession | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<TutorialSession>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }

    return {
      active: parsed.active === true,
      replay: parsed.replay === true,
      originalCoins:
        typeof parsed.originalCoins === "number" ? parsed.originalCoins : null,
      originalPetState:
        parsed.originalPetState &&
        typeof parsed.originalPetState === "object" &&
        typeof parsed.originalPetState.coins === "number" &&
        typeof parsed.originalPetState.xpGained === "number" &&
        typeof parsed.originalPetState.xpLevel === "number" &&
        typeof parsed.originalPetState.food === "number"
          ? {
              coins: parsed.originalPetState.coins,
              xpGained: parsed.originalPetState.xpGained,
              xpLevel: parsed.originalPetState.xpLevel,
              food: parsed.originalPetState.food,
              lastFedAt:
                typeof parsed.originalPetState.lastFedAt === "string" ||
                parsed.originalPetState.lastFedAt === null
                  ? parsed.originalPetState.lastFedAt
                  : null,
            }
          : null,
      replayCoins:
        typeof parsed.replayCoins === "number" ? parsed.replayCoins : null,
      replayXpLevel:
        typeof parsed.replayXpLevel === "number" ? parsed.replayXpLevel : 0,
      replayXpGained:
        typeof parsed.replayXpGained === "number" ? parsed.replayXpGained : 0,
      replayFoods: Array.isArray(parsed.replayFoods)
        ? parsed.replayFoods.filter(
            (food): food is string => typeof food === "string",
          )
        : [],
      practiceDose:
        parsed.practiceDose &&
        typeof parsed.practiceDose === "object" &&
        typeof parsed.practiceDose.medicationId === "string" &&
        typeof parsed.practiceDose.scheduledDoseTime === "string"
          ? {
              medicationId: parsed.practiceDose.medicationId,
              scheduledDoseTime: parsed.practiceDose.scheduledDoseTime,
            }
          : null,
      portion:
        typeof parsed.portion === "number"
          ? parsed.portion
          : TUTORIAL_PORTIONS.FOOD_TUTORIAL,
      step: typeof parsed.step === "number" ? parsed.step : 0,
      medicationType:
        parsed.medicationType === "Pill" ||
        parsed.medicationType === "Syrup" ||
        parsed.medicationType === "Shot"
          ? parsed.medicationType
          : null,
      shouldShowMedicationDrag: parsed.shouldShowMedicationDrag === true,
    };
  } catch {
    return null;
  }
};

const persistSession = (session: TutorialSession | null) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const persistAndSetSession = (
  setSession: React.Dispatch<React.SetStateAction<TutorialSession | null>>,
  session: TutorialSession | null,
) => {
  persistSession(session);
  setSession(session);
};

const readSuppressAutoStart = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(SUPPRESS_AUTO_START_KEY) === "true";
};

const persistSuppressAutoStart = (value: boolean) => {
  if (typeof window === "undefined") {
    return;
  }

  if (value) {
    window.localStorage.setItem(SUPPRESS_AUTO_START_KEY, "true");
    return;
  }

  window.localStorage.removeItem(SUPPRESS_AUTO_START_KEY);
};

const getSessionProgressRank = (session: TutorialSession): number => {
  if (session.portion >= TUTORIAL_PORTIONS.END_TUTORIAL) {
    return 4;
  }

  if (session.portion >= TUTORIAL_PORTIONS.FEED_TUTORIAL) {
    return 3;
  }

  if (session.shouldShowMedicationDrag) {
    return 2;
  }

  if (session.portion >= TUTORIAL_PORTIONS.LOG_TUTORIAL) {
    return 1;
  }

  return 0;
};

const getProgressRank = (progress: {
  hasPurchasedFood: boolean;
  hasTakenTutorialMedication: boolean;
  hasFedPet: boolean;
}): number => {
  if (progress.hasFedPet) {
    return 4;
  }

  if (progress.hasTakenTutorialMedication) {
    return 2;
  }

  if (progress.hasPurchasedFood) {
    return 1;
  }

  return 0;
};

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export const TutorialProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useUser();
  const { data: tutorialCompleted, isSuccess: tutorialStatusLoaded } =
    useTutorialStatus(userId);
  const { data: userProfile } = useUserProfile(userId);
  const { data: realPet } = usePet();
  const [session, setSession] = useState<TutorialSession | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [suppressAutoStart, setSuppressAutoStart] = useState(false);
  const [completionTriggered, setCompletionTriggered] =
    useState<boolean>(false);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const setupTutorialMedication = useSetupTutorialMedication();
  const resetTutorial = useResetTutorial();

  useEffect(() => {
    setSession(readStoredSession());
    setSuppressAutoStart(readSuppressAutoStart());
    setSessionLoaded(true);
  }, []);

  const isInitialTutorial = tutorialStatusLoaded && tutorialCompleted === false;
  const isActive =
    !!session?.active ||
    (!!sessionLoaded && !!tutorialStatusLoaded && isInitialTutorial);
  const isReplay = session?.replay === true;
  const portion = session?.portion ?? TUTORIAL_PORTIONS.FOOD_TUTORIAL;
  const step = session?.step ?? 0;
  const originalCoins = session?.originalCoins ?? null;
  const replayCoins = session?.replayCoins ?? null;
  const replayXpLevel = session?.replayXpLevel ?? 0;
  const replayXpGained = session?.replayXpGained ?? 0;
  const replayFoods = session?.replayFoods ?? [];
  const practiceDose = session?.practiceDose ?? null;
  const medicationType = session?.medicationType ?? null;
  const shouldShowMedicationDrag = session?.shouldShowMedicationDrag ?? false;

  const updateSession = useCallback(
    (
      updater:
        | TutorialSession
        | null
        | ((current: TutorialSession | null) => TutorialSession | null),
    ) => {
      setSession((current) => {
        const next = typeof updater === "function" ? updater(current) : updater;
        persistSession(next);
        return next;
      });
    },
    [],
  );

  useEffect(() => {
    if (!sessionLoaded || !tutorialStatusLoaded) {
      return;
    }

    if (tutorialCompleted === false) {
      if (suppressAutoStart) {
        return;
      }
      updateSession((current) => current ?? createDefaultSession(false, null));
      return;
    }

    if (session?.active && !session.replay) {
      updateSession(null);
      setCompletionTriggered(false);
    }
  }, [
    session?.active,
    session?.replay,
    sessionLoaded,
    tutorialCompleted,
    tutorialStatusLoaded,
    updateSession,
    suppressAutoStart,
  ]);

  const { data: tutorialProgress } = useTutorialProgress(
    sessionLoaded && tutorialStatusLoaded && isInitialTutorial && !isReplay,
  );

  useEffect(() => {
    if (!isActive || isReplay || !tutorialProgress) {
      return;
    }

    updateSession((current) => {
      if (!current || current.replay) {
        return current;
      }

      const currentRank = getSessionProgressRank(current);
      const targetRank = getProgressRank(tutorialProgress);

      if (currentRank >= targetRank) {
        return current;
      }

      if (tutorialProgress.hasFedPet) {
        return {
          ...current,
          practiceDose: null,
          portion: TUTORIAL_PORTIONS.END_TUTORIAL,
          step: 0,
          medicationType: null,
          shouldShowMedicationDrag: false,
        };
      }

      if (tutorialProgress.hasTakenTutorialMedication) {
        return {
          ...current,
          practiceDose: current.practiceDose,
          portion: TUTORIAL_PORTIONS.LOG_TUTORIAL,
          step: 0,
          medicationType: "Pill",
          shouldShowMedicationDrag: true,
        };
      }

      if (tutorialProgress.hasPurchasedFood) {
        return {
          ...current,
          practiceDose: current.practiceDose,
          portion: TUTORIAL_PORTIONS.LOG_TUTORIAL,
          step: 0,
          medicationType: null,
          shouldShowMedicationDrag: false,
        };
      }

      return current;
    });
  }, [isActive, isReplay, tutorialProgress, updateSession]);

  useEffect(() => {
    if (!isActive || portion !== TUTORIAL_PORTIONS.LOG_TUTORIAL) {
      return;
    }

    if (
      practiceDose ||
      shouldShowMedicationDrag ||
      setupTutorialMedication.isPending
    ) {
      return;
    }

    setupTutorialMedication.mutate(undefined, {
      onSuccess: (tutorialMedication) => {
        updateSession((current) =>
          current
            ? {
                ...current,
                practiceDose: tutorialMedication,
              }
            : current,
        );
      },
    });
  }, [
    isActive,
    portion,
    practiceDose,
    setupTutorialMedication,
    shouldShowMedicationDrag,
    updateSession,
  ]);

  useEffect(() => {
    if (!isActive) {
      setCompletionTriggered(false);
      return;
    }

    const handleKeyPress = () => {
      const dialogues = TUTORIAL_DIALOGUES[portion];
      if (!dialogues?.length) {
        return;
      }

      const nextStep = step + 1;
      if (
        portion === TUTORIAL_PORTIONS.END_TUTORIAL &&
        nextStep >= dialogues.length
      ) {
        if (completionTriggered) {
          return;
        }

        setCompletionTriggered(true);

        if (isReplay) {
          resetTutorial.mutate(
            session?.originalPetState
              ? { restorePetState: session.originalPetState }
              : undefined,
            {
              onSuccess: () => {
                persistSuppressAutoStart(true);
                setSuppressAutoStart(true);
                persistSession(null);
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
            },
          );
          return;
        }

        if (!updateTutorialStatus.isPending && userId) {
          updateTutorialStatus.mutate(
            { userId, tutorial_completed: true },
            {
              onSuccess: () => updateSession(null),
              onError: () => setCompletionTriggered(false),
            },
          );
        }
        return;
      }

      updateSession((current) =>
        current
          ? {
              ...current,
              step: Math.min(nextStep, dialogues.length - 1),
            }
          : current,
      );
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    completionTriggered,
    isActive,
    isReplay,
    portion,
    resetTutorial,
    step,
    session?.originalPetState,
    updateSession,
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
          step ===
            TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.FOOD_TUTORIAL].length - 1
        );
      }

      if (buttonType === "log") {
        return (
          portion === TUTORIAL_PORTIONS.LOG_TUTORIAL &&
          step === TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.LOG_TUTORIAL].length - 1
        );
      }

      return false;
    },
    [isActive, portion, step],
  );

  const completeTutorialMedicationStep = useCallback(
    (nextMedicationType: "Pill" | "Syrup" | "Shot" = "Pill") => {
      if (!isActive) {
        return;
      }

      updateSession((current) =>
        current
          ? {
              ...current,
              medicationType: nextMedicationType,
              shouldShowMedicationDrag: true,
              step: 0,
            }
          : current,
      );
    },
    [isActive, updateSession],
  );

  const markFoodPurchased = useCallback(() => {
    if (!isActive || portion !== TUTORIAL_PORTIONS.FOOD_TUTORIAL) {
      return;
    }

    if (isReplay) {
      updateSession((current) =>
        current
          ? {
              ...current,
              portion: TUTORIAL_PORTIONS.LOG_TUTORIAL,
              step: 0,
            }
          : current,
      );
      return;
    }

    if (setupTutorialMedication.isPending) {
      return;
    }

    setupTutorialMedication.mutate(undefined, {
      onSuccess: (tutorialMedication) => {
        updateSession((current) =>
          current
            ? {
                ...current,
                practiceDose: tutorialMedication,
                portion: TUTORIAL_PORTIONS.LOG_TUTORIAL,
                step: 0,
              }
            : current,
        );
      },
      onError: (error) => {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to prepare the tutorial practice dose.",
        );
      },
    });
  }, [isActive, isReplay, portion, setupTutorialMedication, updateSession]);

  const markMedicationDragComplete = useCallback(() => {
    if (
      !isActive ||
      portion !== TUTORIAL_PORTIONS.LOG_TUTORIAL ||
      !shouldShowMedicationDrag
    ) {
      return;
    }

    updateSession((current) =>
      current
        ? {
            ...current,
            practiceDose: null,
            portion: TUTORIAL_PORTIONS.FEED_TUTORIAL,
            step: 0,
            medicationType: null,
            shouldShowMedicationDrag: false,
          }
        : current,
    );
  }, [isActive, portion, shouldShowMedicationDrag, updateSession]);

  const markPetFed = useCallback(() => {
    if (!isActive || portion !== TUTORIAL_PORTIONS.FEED_TUTORIAL) {
      return;
    }

    updateSession((current) =>
      current
        ? {
            ...current,
            portion: TUTORIAL_PORTIONS.END_TUTORIAL,
            step: 0,
            replayXpLevel:
              current.replay &&
              current.replayXpGained + TUTORIAL_REPLAY_XP_GAIN >=
                calculateXPForLevel(current.replayXpLevel)
                ? current.replayXpLevel + 1
                : current.replayXpLevel,
            replayXpGained:
              current.replay &&
              current.replayXpGained + TUTORIAL_REPLAY_XP_GAIN >=
                calculateXPForLevel(current.replayXpLevel)
                ? current.replayXpGained +
                  TUTORIAL_REPLAY_XP_GAIN -
                  calculateXPForLevel(current.replayXpLevel)
                : current.replay
                  ? current.replayXpGained + TUTORIAL_REPLAY_XP_GAIN
                  : current.replayXpGained,
          }
        : current,
    );
  }, [isActive, portion, updateSession]);

  const purchaseReplayFood = useCallback(
    (foodName: string, cost: number) => {
      if (!isReplay) {
        return;
      }

      updateSession((current) => {
        if (!current || !current.replay) {
          return current;
        }

        const currentCoins = current.replayCoins ?? 0;
        if (currentCoins < cost || current.replayFoods.includes(foodName)) {
          return current;
        }

        return {
          ...current,
          replayCoins: currentCoins - cost,
          replayFoods: [...current.replayFoods, foodName],
        };
      });
    },
    [isReplay, updateSession],
  );

  const consumeReplayFood = useCallback(
    (foodName: string) => {
      if (!isReplay) {
        return;
      }

      updateSession((current) => {
        if (!current || !current.replay) {
          return current;
        }

        return {
          ...current,
          replayFoods: current.replayFoods.filter((food) => food !== foodName),
        };
      });
    },
    [isReplay, updateSession],
  );

  const startReplay = useCallback(async () => {
    persistSuppressAutoStart(false);
    setSuppressAutoStart(false);

    const replayStartingCoins =
      session?.replay && originalCoins !== null
        ? originalCoins
        : (realPet?.coins ?? 0);
    const replayStartingPetState: ReplayPetSnapshot | null =
      session?.replay && session.originalPetState !== null
        ? session.originalPetState
        : realPet
          ? {
              coins: realPet.coins,
              xpGained: realPet.xpGained,
              xpLevel: realPet.xpLevel,
              food: realPet.food,
              lastFedAt: realPet.lastFedAt,
            }
          : null;

    try {
      await resetTutorial.mutateAsync(undefined);

      const replaySession = createDefaultSession(
        true,
        replayStartingCoins,
        replayStartingPetState,
        100,
      );

      persistAndSetSession(setSession, replaySession);
      window.location.assign("/");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset tutorial progress.",
      );
    }
  }, [
    originalCoins,
    realPet,
    resetTutorial,
    session?.originalPetState,
    session?.replay,
  ]);

  const getTutorialText = useCallback(() => {
    if (shouldShowMedicationDrag) {
      return "Feed me the medicine!";
    }

    const dialogues = TUTORIAL_DIALOGUES[portion];
    if (!dialogues || step >= dialogues.length) {
      return undefined;
    }

    const userName = userProfile?.name?.trim() || "Friend";
    const petName = realPet?.name?.trim() || "Paws";

    return dialogues[step]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  }, [
    portion,
    realPet?.name,
    shouldShowMedicationDrag,
    step,
    userProfile?.name,
  ]);

  const value = useMemo(
    () => ({
      isActive,
      isReplay,
      replayCoins,
      replayXpLevel,
      replayXpGained,
      replayFoods,
      practiceDose,
      tutorialPortion: portion,
      tutorialStep: step,
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
      getTutorialText,
      isActive,
      isReplay,
      replayCoins,
      replayXpGained,
      replayXpLevel,
      replayFoods,
      practiceDose,
      markFoodPurchased,
      markMedicationDragComplete,
      markPetFed,
      completeTutorialMedicationStep,
      purchaseReplayFood,
      consumeReplayFood,
      medicationType,
      portion,
      resetTutorial.isPending,
      shouldEnlargeButton,
      shouldShowMedicationDrag,
      startReplay,
      step,
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
