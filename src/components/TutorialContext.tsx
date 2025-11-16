import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  ReactNode,
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

interface TutorialState {
  portion: number;
  step: number;
}

type TutorialAction =
  | { type: "SET_PORTION_AND_STEP"; payload: { portion: number; step: number } }
  | { type: "SET_STEP"; payload: number };

const createInitialState = (): TutorialState => ({
  portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  step: 0,
});

const tutorialReducer = (
  state: TutorialState,
  action: TutorialAction,
): TutorialState => {
  switch (action.type) {
    case "SET_PORTION_AND_STEP":
      return {
        ...state,
        portion: action.payload.portion,
        step: action.payload.step,
      };
    case "SET_STEP":
      return { ...state, step: action.payload };
    default:
      return state;
  }
};

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useUser();
  const { data: tutorialCompleted, isSuccess: tutorialStatusLoaded } =
    useTutorialStatus(userId);
  const { data: userProfile } = useUserProfile(userId);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const isTutorial = tutorialStatusLoaded && !tutorialCompleted;

  const { data: realPet } = usePet();
  const { data: tutorialProgress } = useTutorialProgress(isTutorial);
  const setupTutorialMedication = useSetupTutorialMedication();
  const [state, dispatch] = useReducer(tutorialReducer, undefined, () =>
    createInitialState(),
  );

  const completionTriggeredRef = useRef(false);

  const { portion, step } = state;

  useEffect(() => {
    if (!isTutorial) {
      completionTriggeredRef.current = false;
    }
  }, [isTutorial]);

  useEffect(() => {
    if (!isTutorial) return;
    if (portion !== TUTORIAL_PORTIONS.LOG_TUTORIAL) return;
    if (setupTutorialMedication.isPending) return;

    setupTutorialMedication.mutate(undefined, {
      onError: (error) => {
        console.error("Unable to setup tutorial medication", error);
      },
    });
  }, [isTutorial, portion, setupTutorialMedication]);

  useEffect(() => {
    if (!isTutorial) return;

    const handleKeyPress = () => {
      const currentDialogues = TUTORIAL_DIALOGUES[portion];
      if (!currentDialogues || currentDialogues.length === 0) return;

      const nextStep = step + 1;

      if (portion === TUTORIAL_PORTIONS.END_TUTORIAL) {
        if (nextStep >= currentDialogues.length) {
          if (
            userId &&
            !completionTriggeredRef.current &&
            !updateTutorialStatus.isPending
          ) {
            completionTriggeredRef.current = true;
            updateTutorialStatus.mutate(
              {
                userId,
                tutorial_completed: true,
              },
              {
                onError: () => {
                  completionTriggeredRef.current = false;
                },
              },
            );
          }
          return;
        }

        dispatch({ type: "SET_STEP", payload: nextStep });
        return;
      }

      const clampedStep = Math.min(nextStep, currentDialogues.length - 1);
      dispatch({ type: "SET_STEP", payload: clampedStep });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isTutorial, portion, step, userId, updateTutorialStatus]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!tutorialProgress) return;

    let targetPortion: number = TUTORIAL_PORTIONS.FOOD_TUTORIAL;
    if (tutorialProgress.hasFedPet) {
      targetPortion = TUTORIAL_PORTIONS.END_TUTORIAL;
    } else if (tutorialProgress.hasTakenTutorialMedication) {
      targetPortion = TUTORIAL_PORTIONS.FEED_TUTORIAL;
    } else if (tutorialProgress.hasPurchasedFood) {
      targetPortion = TUTORIAL_PORTIONS.LOG_TUTORIAL;
    }

    if (portion < targetPortion) {
      dispatch({
        type: "SET_PORTION_AND_STEP",
        payload: { portion: targetPortion, step: 0 },
      });
    }
  }, [tutorialProgress, isTutorial, portion]);

  const advanceToPortion = useCallback(
    (targetPortion: number) => {
      if (!isTutorial) return;

      dispatch({
        type: "SET_PORTION_AND_STEP",
        payload: { portion: targetPortion, step: 0 },
      });
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
    if (!dialogues) return undefined;
    if (step >= dialogues.length) return undefined;

    const userName = userProfile?.name?.trim() || "Friend";
    const petName = realPet?.name?.trim() || "Paws";

    return dialogues[step]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  }, [portion, step, userProfile?.name, realPet?.name]);

  const contextValue = useMemo<TutorialContextType>(
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
    <TutorialContext.Provider value={contextValue}>
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
