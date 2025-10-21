import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { Pet } from "@/types/pet";
import { WithId } from "@/types/models";
import { Bag } from "@/types/inventory";
import { usePet } from "./hooks/usePet";
import { usePetBag } from "./hooks/useInventory";
import { useTutorialStatus, useUpdateTutorialStatus } from "./hooks/useAuth";
import { useUser } from "./UserContext";
import {
  getPracticeDose,
  TUTORIAL_STORAGE_KEYS,
  TUTORIAL_PORTIONS,
  TUTORIAL_DIALOGUES,
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

const TutorialContext = createContext<TutorialContextType | undefined>(
  undefined,
);

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId } = useUser();
  const { data: tutorialCompleted } = useTutorialStatus(userId);
  const updateTutorialStatus = useUpdateTutorialStatus();
  const isTutorial = !tutorialCompleted;

  const { data: realPet } = usePet();
  const { data: realBag } = usePetBag(realPet?._id);

  const [pet, setPet] = useState<WithId<Pet> | null>(null);
  const [bag, setBag] = useState<Bag | null>(null);
  const [isPracticeDoseTaken, setIsPracticeDoseTaken] = useState(false);
  const [practiceDose, setPracticeDose] = useState<LogType>(getPracticeDose());
  const [tutorialPortion, setTutorialPortion] = useState<number>(
    TUTORIAL_PORTIONS.FOOD_TUTORIAL,
  );
  const [tutorialStep, setTutorialStep] = useState(0);

  const hasLoadedProgress = React.useRef(false);

  useEffect(() => {
    if (realPet && !pet) {
      setPet({
        ...realPet,
        xpLevel: 0,
        xpGained: 0,
        coins: 0,
        food: 0,
      });
    }
  }, [realPet, pet]);

  useEffect(() => {
    if (realBag && !bag) {
      setBag({
        clothing: [],
        shoes: [],
        hat: [],
        occupation: [],
        background: [],
        food: [],
      });
    }
  }, [realBag, bag]);

  useEffect(() => {
    if (!isTutorial) {
      hasLoadedProgress.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    if (!pet || !bag) return;
    if (hasLoadedProgress.current) return;

    const savedPortion = localStorage.getItem(
      TUTORIAL_STORAGE_KEYS.CURRENT_PORTION,
    );
    if (savedPortion !== null) {
      const portion = parseInt(savedPortion, 10);
      setTutorialPortion(portion);
      setTutorialStep(0);

      if (portion === TUTORIAL_PORTIONS.LOG_TUTORIAL && pet.coins < 100) {
        updatePet({ coins: 100 });
      } else if (portion === TUTORIAL_PORTIONS.FEED_TUTORIAL) {
        if (pet.food < 1) {
          updatePet({ food: 1 });
        }
        if (bag.food.length === 0) {
          setBag({ ...bag, food: [storeItems.food.PIZZA] });
        }
      }
    }

    hasLoadedProgress.current = true;
  }, [isTutorial, pet, bag, updatePet]);

  useEffect(() => {
    if (!isTutorial) return;
    if (!pet) return;

    const handleKeyPress = () => {
      setTutorialStep((prev) => {
        const currentDialogues = TUTORIAL_DIALOGUES[tutorialPortion];
        const nextStep = prev + 1;

        if (
          tutorialPortion === TUTORIAL_PORTIONS.FOOD_TUTORIAL &&
          nextStep === 3 &&
          pet
        ) {
          updatePet({ coins: pet.coins + 100 });
        }

        if (tutorialPortion === TUTORIAL_PORTIONS.END_TUTORIAL) {
          if (nextStep >= currentDialogues.length && userId) {
            updateTutorialStatus.mutate(
              {
                userId,
                tutorial_completed: true,
              },
              {
                onSuccess: () => {
                  localStorage.removeItem(
                    TUTORIAL_STORAGE_KEYS.CURRENT_PORTION,
                  );
                  window.location.reload();
                },
              },
            );
          }
          return nextStep;
        }

        return Math.min(nextStep, currentDialogues.length - 1);
      });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    isTutorial,
    pet,
    tutorialPortion,
    userId,
    updateTutorialStatus,
    updatePet,
  ]);

  const getTutorialText = () => {
    const currentDialogues = TUTORIAL_DIALOGUES[tutorialPortion];
    if (tutorialStep >= currentDialogues.length) return undefined;

    const userName = "PLACEHOLDER";
    const petName = pet?.name || "Paws";

    return currentDialogues[tutorialStep]
      .replace("{userName}", userName)
      .replace("{petName}", petName);
  };

  const advanceToPortion = (portion: number) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        TUTORIAL_STORAGE_KEYS.CURRENT_PORTION,
        portion.toString(),
      );
    }

    if (portion === TUTORIAL_PORTIONS.LOG_TUTORIAL) {
      setPracticeDose(getPracticeDose());
      setIsPracticeDoseTaken(false);
    }

    setTutorialPortion(portion);
    setTutorialStep(0);
  };

  const shouldShowPracticeDose = () => {
    return tutorialPortion === TUTORIAL_PORTIONS.LOG_TUTORIAL;
  };

  const shouldEnlargeButton = (buttonType: "store" | "log") => {
    if (buttonType === "store") {
      return (
        tutorialPortion === TUTORIAL_PORTIONS.FOOD_TUTORIAL &&
        tutorialStep ===
          TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.FOOD_TUTORIAL].length - 1
      );
    } else if (buttonType === "log") {
      return (
        tutorialPortion === TUTORIAL_PORTIONS.LOG_TUTORIAL &&
        tutorialStep ===
          TUTORIAL_DIALOGUES[TUTORIAL_PORTIONS.LOG_TUTORIAL].length - 1
      );
    }
    return false;
  };

  const feedPet = (
    onSuccess?: (updatedPet: WithId<Pet>) => void,
    onError?: (error: Error) => void,
  ) => {
    if (!pet) {
      if (onError) onError(new Error("No pet available"));
      return;
    }

    const updatedPet = calculateTutorialPetFeed(pet);
    setPet(updatedPet);

    advanceToPortion(TUTORIAL_PORTIONS.END_TUTORIAL);

    if (onSuccess) onSuccess(updatedPet);
  };

  const updatePet = useCallback(
    (updates: Partial<Pet>) => {
      if (!pet) return;
      setPet({ ...pet, ...updates });
    },
    [pet],
  );

  const purchaseItem = (
    name: string,
    type: string,
    cost: number,
    onSuccess?: () => void,
  ) => {
    if (!pet || !bag) return;

    const { pet: updatedPet, bag: updatedBag } = calculateTutorialPurchase(
      pet,
      bag,
      name,
      type,
      cost,
    );

    setPet(updatedPet);
    setBag(updatedBag);

    if (type === "food") {
      advanceToPortion(TUTORIAL_PORTIONS.LOG_TUTORIAL);
    }

    if (onSuccess) onSuccess();
  };

  const handlePracticeDoseCheckIn = (onSuccess?: () => void) => {
    if (onSuccess) onSuccess();
  };

  const handlePracticeDoseLog = (onSuccess?: () => void) => {
    if (!pet) return;

    const updatedPet = calculateTutorialMedicationLog(pet);
    setPet(updatedPet);

    if (onSuccess) onSuccess();
  };

  const completePracticeDoseLog = () => {
    setIsPracticeDoseTaken(true);
    setPracticeDose({
      ...practiceDose,
      status: "taken",
      lastTaken: new Date().toISOString(),
    });
  };

  const resetTutorial = () => {
    if (!realPet || !realBag) return;

    setPet({
      ...realPet,
      xpLevel: 0,
      xpGained: 0,
      coins: 0,
      food: 0,
    });

    setBag({
      clothing: [],
      shoes: [],
      hat: [],
      occupation: [],
      background: [],
      food: [],
    });

    setIsPracticeDoseTaken(false);
    setPracticeDose(getPracticeDose());

    if (typeof window !== "undefined") {
      localStorage.removeItem(TUTORIAL_STORAGE_KEYS.CURRENT_PORTION);
    }
    setTutorialPortion(TUTORIAL_PORTIONS.FOOD_TUTORIAL);
    setTutorialStep(0);
    hasLoadedProgress.current = false;
  };

  return (
    <TutorialContext.Provider
      value={{
        pet,
        bag,
        practiceDose,
        isPracticeDoseTaken,
        tutorialPortion,
        tutorialStep,
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
      }}
    >
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
