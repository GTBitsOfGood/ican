import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePet } from "./hooks/usePet";
import {
  useTutorialStatus,
  useUpdateTutorialStatus,
  useUserProfile,
} from "./hooks/useAuth";
import { useUser } from "./UserContext";
import { TUTORIAL_DIALOGUES, TUTORIAL_PORTIONS } from "@/constants/tutorial";
import {
  useSetupTutorialMedication,
  useTutorialProgress,
} from "./hooks/useTutorial";

interface TutorialContextType {
  tutorialPortion: number;
  tutorialStep: number;
  getTutorialText: () => string | undefined;
  advanceToPortion: (portion: number) => void;
  shouldEnlargeButton: (buttonType: "store" | "log") => boolean;
}

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
  const { data: tutorialProgress } = useTutorialProgress(
    tutorialStatusLoaded && !tutorialCompleted,
  );
  const updateTutorialStatus = useUpdateTutorialStatus();
  const setupTutorialMedication = useSetupTutorialMedication();

  const isTutorial = tutorialStatusLoaded && !tutorialCompleted;

  const [portion, setPortion] = useState<number>(
    TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  );
  const [step, setStep] = useState<number>(0);
  const [completionTriggered, setCompletionTriggered] =
    useState<boolean>(false);

  // Reset completion when exiting tutorial
  useEffect(() => {
    if (!isTutorial) {
      setCompletionTriggered(false);
    }
  }, [isTutorial]);

  // Sync with tutorial progress
  useEffect(() => {
    if (!isTutorial || !tutorialProgress) return;

    let targetPortion: number = TUTORIAL_PORTIONS.FOOD_TUTORIAL;
    if (tutorialProgress.hasFedPet) {
      targetPortion = TUTORIAL_PORTIONS.END_TUTORIAL;
    } else if (tutorialProgress.hasTakenTutorialMedication) {
      targetPortion = TUTORIAL_PORTIONS.FEED_TUTORIAL;
    } else if (tutorialProgress.hasPurchasedFood) {
      targetPortion = TUTORIAL_PORTIONS.LOG_TUTORIAL;
    }

    if (portion < targetPortion) {
      setPortion(targetPortion);
      setStep(0);
    }
  }, [tutorialProgress, isTutorial, portion]);

  // Setup medication for log tutorial
  useEffect(() => {
    if (
      !isTutorial ||
      portion !== TUTORIAL_PORTIONS.LOG_TUTORIAL ||
      setupTutorialMedication.isPending
    ) {
      return;
    }
    setupTutorialMedication.mutate();
  }, [isTutorial, portion, setupTutorialMedication]);

  // Handle keypress for tutorial advancement
  useEffect(() => {
    if (!isTutorial) return;

    const handleKeyPress = () => {
      const dialogues = TUTORIAL_DIALOGUES[portion];
      if (!dialogues?.length) return;

      const nextStep = step + 1;
      if (
        portion === TUTORIAL_PORTIONS.END_TUTORIAL &&
        nextStep >= dialogues.length
      ) {
        // Complete tutorial
        if (!completionTriggered && !updateTutorialStatus.isPending && userId) {
          setCompletionTriggered(true);
          updateTutorialStatus.mutate(
            { userId, tutorial_completed: true },
            {
              onError: () => setCompletionTriggered(false),
            },
          );
        }
        return;
      }

      // Advance step
      setStep(Math.min(nextStep, dialogues.length - 1));
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isTutorial,
    portion,
    step,
    userId,
    completionTriggered,
    updateTutorialStatus,
  ]);

  const advanceToPortion = useCallback(
    (targetPortion: number) => {
      if (isTutorial) {
        setPortion(targetPortion);
        setStep(0);
      }
    },
    [isTutorial],
  );

  const shouldEnlargeButton = useCallback(
    (buttonType: "store" | "log") => {
      if (!isTutorial) return false;
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
    [isTutorial, portion, step],
  );

  const getTutorialText = useCallback(() => {
    const dialogues = TUTORIAL_DIALOGUES[portion];
    if (!dialogues || step >= dialogues.length) return undefined;

    const userName = userProfile?.name?.trim() || "Friend";
    const petName = realPet?.name?.trim() || "Paws";

    return dialogues[step]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  }, [portion, step, userProfile?.name, realPet?.name]);

  const value = useMemo(
    () => ({
      tutorialPortion: portion,
      tutorialStep: step,
      getTutorialText,
      advanceToPortion,
      shouldEnlargeButton,
    }),
    [getTutorialText, advanceToPortion, shouldEnlargeButton, step, portion],
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
