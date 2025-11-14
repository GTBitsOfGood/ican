import { useRouter } from "next/router";
import Home from "../index";
import { usePet } from "@/components/hooks/usePet";
import LoadingScreen from "@/components/loadingScreen";
import { usePetFoods } from "@/components/hooks/useInventory";

export default function Food() {
  const { data: realPet, isLoading: petLoading } = usePet();
  const pet = realPet;

  const { data: realFoods, isLoading: foodsLoading } = usePetFoods(
    pet && pet.food > 0 ? pet._id : undefined,
  );

  const foods = realFoods;

  const router = useRouter();

  if (foodsLoading || petLoading) {
    return <LoadingScreen />;
  }

  if (router.isReady && pet && pet.food <= 0) {
    console.error("Pet is not able to feed.");
    router.push("/");
    return <LoadingScreen />;
  }

  return <Home activeModal="food" foods={foods} />;
}
