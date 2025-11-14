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
import { useQueryClient } from "@tanstack/react-query";
import { usePet, PET_QUERY_KEYS } from "./hooks/usePet";
import {
  useTutorialStatus,
  useUpdateTutorialStatus,
  useUserProfile,
} from "./hooks/useAuth";
import { useUser } from "./UserContext";
import {
  clearTutorialProgress,
  getPracticeDose,
  readTutorialProgress,
  writeTutorialProgress,
  TUTORIAL_DIALOGUES,
  TUTORIAL_PORTIONS,
} from "@/constants/tutorial";
import { LogType } from "@/types/log";
import TutorialHTTPClient from "@/http/tutorialHTTPClient";

interface TutorialContextType {
  practiceDose: LogType;
  isPracticeDoseTaken: boolean;
  tutorialPortion: number;
  tutorialStep: number;
  handlePracticeDoseCheckIn: (onSuccess?: () => void) => void;
  handlePracticeDoseLog: (onSuccess?: () => void) => void;
  completePracticeDoseLog: () => void;
  resetTutorial: () => void;
  getTutorialText: () => string | undefined;
  advanceToPortion: (portion: number) => void;
  shouldShowPracticeDose: () => boolean;
  shouldEnlargeButton: (buttonType: "store" | "log") => boolean;
}

interface TutorialState {
  portion: number;
  step: number;
  practiceDose: LogType;
  isPracticeDoseTaken: boolean;
}

type TutorialAction =
  | { type: "SET_PORTION_AND_STEP"; payload: { portion: number; step: number } }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PRACTICE_DOSE"; payload: LogType }
  | { type: "SET_PRACTICE_DOSE_TAKEN"; payload: boolean }
  | { type: "RESET" };

const createInitialState = (): TutorialState => ({
  portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  step: 0,
  practiceDose: getPracticeDose(),
  isPracticeDoseTaken: false,
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
    case "SET_PRACTICE_DOSE":
      return { ...state, practiceDose: action.payload };
    case "SET_PRACTICE_DOSE_TAKEN":
      return { ...state, isPracticeDoseTaken: action.payload };
    case "RESET":
      return createInitialState();
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
  const { data: tutorialCompleted } = useTutorialStatus(userId);
  const { data: userProfile } = useUserProfile(userId);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const isTutorial = !tutorialCompleted;

  const queryClient = useQueryClient();
  const { data: realPet } = usePet();
  const [state, dispatch] = useReducer(tutorialReducer, undefined, () =>
    createInitialState(),
  );

  const completionTriggeredRef = useRef(false);
  const hasHydratedProgress = useRef(false);

  const { portion, step, practiceDose, isPracticeDoseTaken } = state;

  useEffect(() => {
    if (!isTutorial) {
      hasHydratedProgress.current = false;
      completionTriggeredRef.current = false;
    }
  }, [isTutorial]);

  const ensureStarterKit = useCallback(async () => {
    if (!isTutorial) return;
    if (!realPet?._id) return;
    try {
      await TutorialHTTPClient.ensureStarterKit();
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.pet(userId),
        });
      }
    } catch (error) {
      console.error("Unable to ensure tutorial starter kit", error);
    }
  }, [isTutorial, queryClient, realPet?._id, userId]);

  useEffect(() => {
    if (!isTutorial) return;
    if (hasHydratedProgress.current) return;

    const savedProgress = readTutorialProgress(userId ?? null);
    if (savedProgress) {
      dispatch({
        type: "SET_PORTION_AND_STEP",
        payload: {
          portion: savedProgress.portion,
          step: savedProgress.step,
        },
      });

      dispatch({
        type: "SET_PRACTICE_DOSE",
        payload: savedProgress.practiceDose,
      });

      dispatch({
        type: "SET_PRACTICE_DOSE_TAKEN",
        payload: savedProgress.isPracticeDoseTaken,
      });
    }

    hasHydratedProgress.current = true;
  }, [isTutorial, userId]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!hasHydratedProgress.current) return;

    writeTutorialProgress(userId ?? null, {
      portion,
      step,
      practiceDose,
      isPracticeDoseTaken,
    });
  }, [isTutorial, isPracticeDoseTaken, portion, practiceDose, step, userId]);

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
                onSuccess: () => {
                  clearTutorialProgress(userId);
                },
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
    if (!isTutorial || !userId) return;
    if (!realPet?._id) return;
    ensureStarterKit();
  }, [ensureStarterKit, isTutorial, realPet?._id, userId]);

  const advanceToPortion = useCallback(
    (targetPortion: number) => {
      if (!isTutorial) return;

      if (targetPortion === TUTORIAL_PORTIONS.LOG_TUTORIAL) {
        dispatch({ type: "SET_PRACTICE_DOSE", payload: getPracticeDose() });
        dispatch({ type: "SET_PRACTICE_DOSE_TAKEN", payload: false });
      }

      dispatch({
        type: "SET_PORTION_AND_STEP",
        payload: { portion: targetPortion, step: 0 },
      });

      if (targetPortion === TUTORIAL_PORTIONS.FOOD_TUTORIAL) {
        ensureStarterKit();
      }
    },
    [ensureStarterKit, isTutorial],
  );

  const shouldShowPracticeDose = useCallback(() => {
    return isTutorial && portion === TUTORIAL_PORTIONS.LOG_TUTORIAL;
  }, [isTutorial, portion]);

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

  const handlePracticeDoseCheckIn = useCallback(
    (onSuccess?: () => void) => {
      if (!isTutorial) return;
      onSuccess?.();
    },
    [isTutorial],
  );

  const handlePracticeDoseLog = useCallback(
    async (onSuccess?: () => void) => {
      if (!isTutorial) return;
      if (!realPet?._id) return;
      try {
        await TutorialHTTPClient.grantPracticeDoseReward();
        if (userId) {
          queryClient.invalidateQueries({
            queryKey: PET_QUERY_KEYS.pet(userId),
          });
        }
        onSuccess?.();
      } catch (error) {
        console.error("Unable to process practice dose reward", error);
      }
    },
    [isTutorial, queryClient, realPet?._id, userId],
  );

  const completePracticeDoseLog = useCallback(() => {
    if (!isTutorial) return;

    dispatch({ type: "SET_PRACTICE_DOSE_TAKEN", payload: true });
    dispatch({
      type: "SET_PRACTICE_DOSE",
      payload: {
        ...practiceDose,
        status: "taken",
        lastTaken: new Date().toISOString(),
      },
    });
  }, [isTutorial, practiceDose]);

  const resetTutorial = useCallback(() => {
    dispatch({ type: "RESET" });
    clearTutorialProgress(userId ?? null);
    hasHydratedProgress.current = false;
    completionTriggeredRef.current = false;
  }, [userId]);

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
      practiceDose,
      isPracticeDoseTaken,
      tutorialPortion: portion,
      tutorialStep: step,
      handlePracticeDoseCheckIn,
      handlePracticeDoseLog,
      completePracticeDoseLog,
      resetTutorial,
      getTutorialText,
      advanceToPortion,
      shouldShowPracticeDose,
      shouldEnlargeButton,
    }),
    [
      advanceToPortion,
      completePracticeDoseLog,
      getTutorialText,
      handlePracticeDoseCheckIn,
      handlePracticeDoseLog,
      isPracticeDoseTaken,
      practiceDose,
      resetTutorial,
      shouldEnlargeButton,
      shouldShowPracticeDose,
      step,
      portion,
    ],
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
