import { useRouter } from "next/router";
import Home from "../index";
import { usePet } from "@/components/hooks/usePet";
import LoadingScreen from "@/components/loadingScreen";
import { usePetFoods } from "@/components/hooks/useInventory";
import { useTutorial } from "@/components/TutorialContext";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";

export default function Food() {
  const tutorial = useTutorial();
  const { data: pet, isLoading: petLoading } = usePet();
  const isTutorialFeed =
    tutorial.isActive &&
    tutorial.tutorialPortion === TUTORIAL_PORTIONS.FEED_TUTORIAL;
  const shouldUseReplayFoods = tutorial.isReplay && isTutorialFeed;
  const { data: foods, isLoading: foodsLoading } = usePetFoods(
    pet && !shouldUseReplayFoods && (pet.food > 0 || isTutorialFeed)
      ? pet._id
      : undefined,
  );
  const router = useRouter();

  if (foodsLoading || petLoading) {
    return <LoadingScreen />;
  }

  if (router.isReady && pet && pet.food <= 0 && !isTutorialFeed) {
    console.error("Pet is not able to feed.");
    router.push("/");
    return <LoadingScreen />;
  }

  return (
    <Home
      activeModal="food"
      foods={shouldUseReplayFoods ? tutorial.replayFoods : foods || []}
      foodCount={shouldUseReplayFoods ? tutorial.replayFoods.length : pet?.food}
    />
  );
}
