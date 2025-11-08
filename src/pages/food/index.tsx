import { useRouter } from "next/router";
import Home from "../index";
import { usePet } from "@/components/hooks/usePet";
import LoadingScreen from "@/components/loadingScreen";
import { usePetFoods } from "@/components/hooks/useInventory";
import { useTutorial } from "@/components/TutorialContext";
import { useTutorialStatus } from "@/components/hooks/useAuth";
import { useUser } from "@/components/UserContext";

export default function Food() {
  const { userId } = useUser();
  const { data: tutorialCompleted } = useTutorialStatus(userId);
  const isTutorial = !tutorialCompleted;

  const { data: realPet, isLoading: petLoading } = usePet();
  const tutorial = useTutorial();

  const pet = isTutorial ? tutorial.pet : realPet;

  const { data: realFoods, isLoading: foodsLoading } = usePetFoods(
    !isTutorial && pet && pet.food > 0 ? pet._id : undefined,
  );

  const tutorialFoods =
    isTutorial && tutorial.bag
      ? tutorial.bag.food.map((item) => item.displayName)
      : [];
  const foods = isTutorial ? tutorialFoods : realFoods;

  const router = useRouter();

  if (!isTutorial && (foodsLoading || petLoading)) {
    return <LoadingScreen />;
  }

  if (router.isReady && pet && pet.food <= 0) {
    console.error("Pet is not able to feed.");
    router.push("/");
    return <LoadingScreen />;
  }

  return <Home activeModal="food" foods={foods} />;
}
