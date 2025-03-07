import Image from "next/image";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";
import { characterImages } from "@/types/characters";
import StoreTabs from "@/components/ui/StoreTabs";

export default function Store() {
  const router = useRouter();
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [purchaseDisabled, setPurchaseDisabled] = useState(true);

  // const storeItems = {
  //   clothes: [
  //     {
  //       itemName: "cool shirt",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "surgeon clothes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "astronaut clothes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "business clothes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "painter clothes",
  //       cost: 100,
  //     },
  //   ],
  //   accessories: [
  //     {
  //       itemName: "musician shoes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "astronaut shoes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "business shoes",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "musician hat",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "sunglasses",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "business hat",
  //       cost: 100,
  //     },
  //     {
  //       itemName: "doctor hat",
  //       cost: 100,
  //     },
  //   ],
  // };

  const tabData = [
    {
      title: "Clothes",
      image: "/path/to/image1.png",
      content: <div>Content for Tab 1</div>,
    },
    {
      title: "Accessories",
      image: "/path/to/image2.png",
      content: <div>Content for Tab 2</div>,
    },
    {
      title: "Backgrounds",
      image: "/path/to/image2.png",
      content: <div>Content for Tab 2</div>,
    },
    {
      title: "Food",
      image: "/path/to/image2.png",
      content: <div>Content for Tab 2</div>,
    },
  ];

  useEffect(() => {
    const getPetData = async () => {
      if (userId) {
        try {
          const pet = await PetHTTPClient.getPet(userId);
          if (pet) {
            setPetData(pet);
            console.log("Fetched pet data:", pet);
          } else {
            console.log("No pet data found for userId:", userId);
          }
        } catch (error) {
          console.error("Error fetching pet data:", error);
        }

        setPurchaseDisabled(false);
      }
    };

    getPetData();
  }, [userId]);

  return (
    <AuthorizedRoute>
      {petData ? (
        <div className="flex">
          <div className="flex flex-col w-[26%] h-screen p-4 bg-[#E6E8F9]">
            <div className="text-[64px] text-center font-bold text-icanBlue-300 font-quantico leading-none">
              Select Item
            </div>
            <div className="text-4xl text-center text-icanBlue-300 font-quantico">
              Click item to learn more!
            </div>
            <div className="flex-1 flex items-center justify-center max-w-[250px] mx-auto">
              <Image
                src={`/characters/${petData.petType}.svg`}
                alt={`${petData.petType}`}
                width={characterImages[petData.petType].width}
                height={characterImages[petData.petType].height}
                draggable="false"
                className="object-contain pointer-events-none select-none"
              />
            </div>
            <div className="mx-auto">
              <button
                // onClick={action}
                disabled={purchaseDisabled}
                className="font-quantico px-6 py-6 mb-4 text-4xl font-bold text-white bg-icanBlue-300"
                type="button"
              >
                Purchase
              </button>
            </div>
          </div>
          <div className="w-[74%] h-screen bg-[#4C539B]">
            <div className="flex justify-between items-center">
              <div className="flex justify-center w-[281px] ml-[31px] py-2 mt-[40px] font-quantico text-black font-bold text-center text-4xl bg-[#E6E8F9] border-[3px] border-black">
                Balance:
                <Image
                  src="/icons/Coin.svg"
                  alt="Coins"
                  width={38}
                  height={38}
                  draggable={false}
                  className="select-none object-contain"
                />
                {petData.coins}
              </div>
              <div
                className="font-pixelify mt-[30px] pr-[60px] text-icanGreen-100 text-7xl leading-none cursor-pointer"
                onClick={() => router.push("/")}
              >
                x
              </div>
            </div>
            <div className="mt-5 mx-[31px]">
              <StoreTabs tabs={tabData} />
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col relative">
          <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
            <div className="flex justify-center items-center h-screen">
              <Image
                className="spin"
                src="/loading.svg"
                alt="loading"
                width={100}
                height={100}
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>
          </div>
        </div>
      )}
    </AuthorizedRoute>
  );
}
