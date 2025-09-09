import { useRouter } from "next/router";
import Home from "../index";
import { useEffect, useState } from "react";
import { usePet } from "@/components/petContext";
import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import LoadingScreen from "@/components/loadingScreen";

export default function Food() {
  const { data: pet } = usePet();
  const [foods, setFoods] = useState<string[] | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady || !pet) return;

    const fetchFoods = async () => {
      try {
        const newFoods = await InventoryHTTPClient.getPetFoods(pet._id);
        setFoods(newFoods);
      } catch (error) {
        console.error("Failed to fetch pet foods:", error);
        router.push("/");
      }
    };

    if (pet.food > 0) {
      fetchFoods();
    } else {
      console.error("Pet is not able to feed.");
      router.push("/");
    }

    fetchFoods();
  }, [router, pet]);

  if (foods) {
    return <Home activeModal="food" foods={foods} />;
  } else {
    return <LoadingScreen />;
  }
}
