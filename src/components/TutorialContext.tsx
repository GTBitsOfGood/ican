import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { create } from "zustand";
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
import { TutorialProgress } from "@/http/tutorialHTTPClient";

interface TutorialContextType {
  tutorialPortion: number;
  tutorialStep: number;
  getTutorialText: () => string | undefined;
  advanceToPortion: (portion: number) => void;
  shouldEnlargeButton: (buttonType: "store" | "log") => boolean;
}

interface TutorialStore {
  portion: number;
  step: number;
  completionTriggered: boolean;
  advanceStep: () => void;
  advanceToPortion: (portion: number) => void;
  resetCompletion: () => void;
  setupMedicationForLogTutorial: (
    mutate: () => void,
    isPending: boolean,
  ) => void;
  completeEntireTutorial: (
    mutate: (data: { userId: string; tutorial_completed: boolean }) => void,
    userId: string,
    isPending: boolean,
  ) => void;
  syncWithProgress: (
    progress: TutorialProgress | undefined,
    currentPortion: number,
  ) => void;
}

const useTutorialStore = create<TutorialStore>((set, get) => ({
  portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  step: 0,
  completionTriggered: false,

  advanceStep: () => {
    const { step, portion } = get();
    const dialogues = TUTORIAL_DIALOGUES[portion];
    if (!dialogues?.length) return;

    const nextStep = step + 1;
    if (
      portion === TUTORIAL_PORTIONS.END_TUTORIAL &&
      nextStep >= dialogues.length
    )
      return;

    set({ step: Math.min(nextStep, dialogues.length - 1) });
  },

  advanceToPortion: (targetPortion) => set({ portion: targetPortion, step: 0 }),
  resetCompletion: () => set({ completionTriggered: false }),

  setupMedicationForLogTutorial: (mutate, isPending) => {
    if (get().portion !== TUTORIAL_PORTIONS.LOG_TUTORIAL || isPending) return;
    mutate();
  },

  completeEntireTutorial: (mutate, userId, isPending) => {
    const { completionTriggered, portion, step } = get();
    const dialogues = TUTORIAL_DIALOGUES[portion];

    if (
      portion !== TUTORIAL_PORTIONS.END_TUTORIAL ||
      step + 1 < dialogues.length ||
      completionTriggered ||
      isPending ||
      !userId
    )
      return;

    set({ completionTriggered: true });
    mutate({ userId, tutorial_completed: true });
  },

  syncWithProgress: (progress, currentPortion) => {
    if (!progress) return;

    let targetPortion: number = TUTORIAL_PORTIONS.FOOD_TUTORIAL;
    if (progress.hasFedPet) targetPortion = TUTORIAL_PORTIONS.END_TUTORIAL;
    else if (progress.hasTakenTutorialMedication)
      targetPortion = TUTORIAL_PORTIONS.FEED_TUTORIAL;
    else if (progress.hasPurchasedFood)
      targetPortion = TUTORIAL_PORTIONS.LOG_TUTORIAL;

    if (currentPortion < targetPortion)
      set({ portion: targetPortion, step: 0 });
  },
}));

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
  const {
    portion,
    step,
    advanceStep,
    advanceToPortion: advanceToPortionAction,
    resetCompletion,
    setupMedicationForLogTutorial,
    completeEntireTutorial,
    syncWithProgress,
  } = useTutorialStore();

  useEffect(() => {
    if (!isTutorial) resetCompletion();
  }, [isTutorial, resetCompletion]);

  useEffect(() => {
    if (isTutorial) syncWithProgress(tutorialProgress, portion);
  }, [tutorialProgress, isTutorial, portion, syncWithProgress]);

  useEffect(() => {
    if (!isTutorial) return;
    setupMedicationForLogTutorial(
      () => setupTutorialMedication.mutate(),
      setupTutorialMedication.isPending,
    );
  }, [
    isTutorial,
    portion,
    setupMedicationForLogTutorial,
    setupTutorialMedication,
  ]);

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
        completeEntireTutorial(
          (data) =>
            updateTutorialStatus.mutate(data, { onError: resetCompletion }),
          userId!,
          updateTutorialStatus.isPending,
        );
        return;
      }

      advanceStep();
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isTutorial,
    portion,
    step,
    userId,
    advanceStep,
    completeEntireTutorial,
    resetCompletion,
    updateTutorialStatus,
  ]);

  const advanceToPortion = useCallback(
    (targetPortion: number) => {
      if (isTutorial) advanceToPortionAction(targetPortion);
    },
    [isTutorial, advanceToPortionAction],
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
