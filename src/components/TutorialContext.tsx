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
import { Pet } from "@/types/pet";
import { WithId } from "@/types/models";
import { Bag } from "@/types/inventory";
import { usePet } from "./hooks/usePet";
import { usePetBag } from "./hooks/useInventory";
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
import {
  calculateTutorialPetFeed,
  calculateTutorialMedicationLog,
  calculateTutorialPurchase,
} from "@/utils/tutorialLogic";
import storeItems from "@/lib/storeItems";

interface TutorialContextType {
  pet: WithId<Pet> | null;
  bag: Bag | null;
  practiceDose: LogType;
  isPracticeDoseTaken: boolean;
  tutorialPortion: number;
  tutorialStep: number;
  feedPet: (
    onSuccess?: (updatedPet: WithId<Pet>) => void,
    onError?: (error: Error) => void,
  ) => void;
  updatePet: (updates: Partial<Pet>) => void;
  purchaseItem: (
    name: string,
    type: string,
    cost: number,
    onSuccess?: () => void,
  ) => void;
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
  pet: WithId<Pet> | null;
  bag: Bag | null;
  practiceDose: LogType;
  isPracticeDoseTaken: boolean;
}

type TutorialAction =
  | { type: "SET_PET"; payload: WithId<Pet> | null }
  | { type: "MERGE_PET"; payload: Partial<WithId<Pet>> }
  | { type: "SET_BAG"; payload: Bag | null }
  | { type: "MERGE_BAG"; payload: Partial<Bag> }
  | { type: "SET_PORTION_AND_STEP"; payload: { portion: number; step: number } }
  | { type: "SET_STEP"; payload: number }
  | { type: "SET_PRACTICE_DOSE"; payload: LogType }
  | { type: "SET_PRACTICE_DOSE_TAKEN"; payload: boolean }
  | {
      type: "RESET";
      payload: {
        pet: WithId<Pet> | null;
        bag: Bag | null;
      };
    };

const createInitialState = (): TutorialState => ({
  portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  step: 0,
  pet: null,
  bag: null,
  practiceDose: getPracticeDose(),
  isPracticeDoseTaken: false,
});

const tutorialReducer = (
  state: TutorialState,
  action: TutorialAction,
): TutorialState => {
  switch (action.type) {
    case "SET_PET":
      return { ...state, pet: action.payload };
    case "MERGE_PET":
      return state.pet
        ? { ...state, pet: { ...state.pet, ...action.payload } }
        : state;
    case "SET_BAG":
      return { ...state, bag: action.payload };
    case "MERGE_BAG":
      return state.bag
        ? { ...state, bag: { ...state.bag, ...action.payload } }
        : state;
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
      return {
        portion: TUTORIAL_PORTIONS.FOOD_TUTORIAL,
        step: 0,
        pet: action.payload.pet,
        bag: action.payload.bag,
        practiceDose: getPracticeDose(),
        isPracticeDoseTaken: false,
      };
    default:
      return state;
  }
};

const createTutorialPet = (pet: WithId<Pet>): WithId<Pet> => ({
  ...pet,
  xpLevel: 0,
  xpGained: 0,
  coins: 0,
  food: 0,
});

const createEmptyBag = (): Bag => ({
  clothing: [],
  shoes: [],
  hat: [],
  occupation: [],
  background: [],
  food: [],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cloneBagStructure = (_bag: Bag): Bag => ({
  clothing: [],
  shoes: [],
  hat: [],
  occupation: [],
  background: [],
  food: [],
});

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

  const { data: realPet } = usePet();
  const { data: realBag } = usePetBag(realPet?._id);
  const [state, dispatch] = useReducer(tutorialReducer, undefined, () =>
    createInitialState(),
  );

  const completionTriggeredRef = useRef(false);
  const hasHydratedProgress = useRef(false);

  const { portion, step, pet, bag, practiceDose, isPracticeDoseTaken } = state;

  useEffect(() => {
    if (!isTutorial) {
      hasHydratedProgress.current = false;
      completionTriggeredRef.current = false;
    }
  }, [isTutorial]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!realPet) return;
    if (pet) return;

    dispatch({ type: "SET_PET", payload: createTutorialPet(realPet) });
  }, [isTutorial, realPet, pet]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!realBag) return;
    if (bag) return;

    const tutorialBag = realBag ? cloneBagStructure(realBag) : createEmptyBag();
    dispatch({ type: "SET_BAG", payload: tutorialBag });
  }, [isTutorial, realBag, bag]);

  const ensurePrerequisites = useCallback(
    (targetPortion: number) => {
      if (!pet || !bag) return;

      if (targetPortion === TUTORIAL_PORTIONS.LOG_TUTORIAL && pet.coins < 100) {
        dispatch({ type: "MERGE_PET", payload: { coins: 100 } });
      }

      if (targetPortion === TUTORIAL_PORTIONS.FEED_TUTORIAL) {
        if (pet.food < 1) {
          dispatch({ type: "MERGE_PET", payload: { food: 1 } });
        }

        if (bag.food.length === 0) {
          dispatch({
            type: "SET_BAG",
            payload: {
              ...bag,
              food: [storeItems.food.PIZZA],
            },
          });
        }
      }
    },
    [bag, pet],
  );

  useEffect(() => {
    if (!isTutorial) return;
    if (!pet || !bag) return;
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
      if (savedProgress.pet) {
        dispatch({ type: "SET_PET", payload: savedProgress.pet });
      }

      if (savedProgress.bag) {
        dispatch({ type: "SET_BAG", payload: savedProgress.bag });
      }

      dispatch({
        type: "SET_PRACTICE_DOSE",
        payload: savedProgress.practiceDose,
      });

      dispatch({
        type: "SET_PRACTICE_DOSE_TAKEN",
        payload: savedProgress.isPracticeDoseTaken,
      });

      if (!savedProgress.pet || !savedProgress.bag) {
        ensurePrerequisites(savedProgress.portion);
      }
    } else {
      ensurePrerequisites(TUTORIAL_PORTIONS.FOOD_TUTORIAL);
    }

    hasHydratedProgress.current = true;
  }, [bag, ensurePrerequisites, isTutorial, pet, userId]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!pet || !bag) return;
    if (!hasHydratedProgress.current) return;

    writeTutorialProgress(userId ?? null, {
      portion,
      step,
      pet,
      bag,
      practiceDose,
      isPracticeDoseTaken,
    });
  }, [
    bag,
    isTutorial,
    isPracticeDoseTaken,
    pet,
    portion,
    practiceDose,
    step,
    userId,
  ]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!pet) return;

    const handleKeyPress = () => {
      const currentDialogues = TUTORIAL_DIALOGUES[portion];
      if (!currentDialogues || currentDialogues.length === 0) return;

      const nextStep = step + 1;

      if (
        portion === TUTORIAL_PORTIONS.FOOD_TUTORIAL &&
        nextStep === 3 &&
        pet
      ) {
        dispatch({
          type: "MERGE_PET",
          payload: { coins: pet.coins + 100 },
        });
      }

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
  }, [isTutorial, portion, step, pet, userId, updateTutorialStatus]);

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

      ensurePrerequisites(targetPortion);
    },
    [ensurePrerequisites, isTutorial],
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

  const updatePet = useCallback(
    (updates: Partial<Pet>) => {
      if (!isTutorial) return;
      if (!pet) return;
      dispatch({ type: "MERGE_PET", payload: updates });
    },
    [isTutorial, pet],
  );

  const feedPet = useCallback(
    (
      onSuccess?: (updatedPet: WithId<Pet>) => void,
      onError?: (error: Error) => void,
    ) => {
      if (!isTutorial) {
        onError?.(new Error("Tutorial inactive"));
        return;
      }

      if (!pet) {
        onError?.(new Error("No tutorial pet available"));
        return;
      }

      const updatedPet = calculateTutorialPetFeed(pet);
      dispatch({ type: "SET_PET", payload: updatedPet });
      advanceToPortion(TUTORIAL_PORTIONS.END_TUTORIAL);
      onSuccess?.(updatedPet);
    },
    [advanceToPortion, isTutorial, pet],
  );

  const purchaseItem = useCallback(
    (name: string, type: string, cost: number, onSuccess?: () => void) => {
      if (!isTutorial) return;
      if (!pet || !bag) return;

      const { pet: updatedPet, bag: updatedBag } = calculateTutorialPurchase(
        pet,
        bag,
        name,
        type,
        cost,
      );

      dispatch({ type: "SET_PET", payload: updatedPet });
      dispatch({ type: "SET_BAG", payload: updatedBag });

      if (type === "food") {
        advanceToPortion(TUTORIAL_PORTIONS.LOG_TUTORIAL);
      }

      onSuccess?.();
    },
    [advanceToPortion, bag, isTutorial, pet],
  );

  const handlePracticeDoseCheckIn = useCallback(
    (onSuccess?: () => void) => {
      if (!isTutorial) return;
      onSuccess?.();
    },
    [isTutorial],
  );

  const handlePracticeDoseLog = useCallback(
    (onSuccess?: () => void) => {
      if (!isTutorial) return;
      if (!pet) return;

      const updatedPet = calculateTutorialMedicationLog(pet);
      dispatch({ type: "SET_PET", payload: updatedPet });
      onSuccess?.();
    },
    [isTutorial, pet],
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
    if (!realPet || !realBag) return;

    const basePet = createTutorialPet(realPet as WithId<Pet>);
    const baseBag = cloneBagStructure(realBag);

    dispatch({
      type: "RESET",
      payload: {
        pet: basePet,
        bag: baseBag,
      },
    });

    clearTutorialProgress(userId ?? null);
    hasHydratedProgress.current = false;
    completionTriggeredRef.current = false;
  }, [realPet, realBag, userId]);

  const getTutorialText = useCallback(() => {
    const dialogues = TUTORIAL_DIALOGUES[portion];
    if (!dialogues) return undefined;
    if (step >= dialogues.length) return undefined;

    const userName = userProfile?.name?.trim() || "Friend";
    const petName = pet?.name?.trim() || "Paws";

    return dialogues[step]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  }, [portion, step, userProfile?.name, pet?.name]);

  const contextValue = useMemo<TutorialContextType>(
    () => ({
      pet,
      bag,
      practiceDose,
      isPracticeDoseTaken,
      tutorialPortion: portion,
      tutorialStep: step,
      feedPet,
      updatePet,
      purchaseItem,
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
      bag,
      completePracticeDoseLog,
      feedPet,
      getTutorialText,
      handlePracticeDoseCheckIn,
      handlePracticeDoseLog,
      isPracticeDoseTaken,
      pet,
      practiceDose,
      purchaseItem,
      resetTutorial,
      shouldEnlargeButton,
      shouldShowPracticeDose,
      step,
      updatePet,
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
