import { useRouter } from "next/router";
import Home from "../index";
import { usePet } from "@/components/hooks/usePet";
import LoadingScreen from "@/components/loadingScreen";
import { usePetFoods } from "@/components/hooks/useInventory";

export default function Food() {
  const { data: pet, isLoading: petLoading } = usePet();
  const { data: foods, isLoading: foodsLoading } = usePetFoods(pet?._id);
  const router = useRouter();

  // was testing
  console.log("ACTUAL PET FOOD VALUE:", pet?.food);
  console.log("Pet loading?", petLoading);
  console.log("Pet loading?", pet?._id);
  if (foodsLoading || petLoading) {
    return <LoadingScreen />;
  }

  // commented out for testing
  if (router.isReady && pet && pet.food <= 0) {
    console.error("Pet is not able to feed.");
    router.push("/");
    return <LoadingScreen />;
  }

  return <Home activeModal="food" foods={foods} />;
}
