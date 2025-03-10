import Image from "next/image";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";
import { characterImages } from "@/types/characters";
import StoreTabs from "@/components/ui/StoreTabs";
import StoreTabContent from "@/components/ui/StoreTabContent";
import StoreHTTPClient from "@/http/storeHTTPClient";
import { BagItem } from "@/db/models";
import { Types } from "mongoose";

export default function Store() {
  const router = useRouter();
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [petBag, setPetBag] = useState<BagItem[]>([]);
  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    displayName: string;
    name: string;
    description: string;
    cost: number;
    image: string;
  } | null>(null);

  useEffect(() => {
    const getPetData = async () => {
      if (userId) {
        try {
          const pet = await PetHTTPClient.getPet(userId);
          const petBag = (await StoreHTTPClient.getPetBag(pet._id)).items;
          if (pet) {
            setPetData(pet);
          } else {
            console.log("No pet data found for userId:", userId);
          }

          if (petBag) {
            setPetBag(petBag);
          } else {
            console.log("No bag");
          }
        } catch (error) {
          console.error("Error fetching pet data:", error);
        }
      }
    };

    getPetData();
  }, [userId]);

  const storeItems = {
    clothes: [
      {
        displayName: "Cool Shirt",
        name: "cool shirt",
        image: "/store/Cool_Shirt.svg",
        cost: 100,
        description: "Cool shirt",
      },
      {
        displayName: "Scrubs",
        name: "doctor clothes",
        image: "/store/Doctor_Clothes.svg",
        cost: 100,
        description: "Help save lives as a doctor or nurse!",
      },
      {
        displayName: "Astronaut",
        name: "astronaut clothes",
        image: "/store/Astronaut_Clothes.svg",
        cost: 100,
        description: "Explore the planets and galaxies with this spacesuit!",
      },
      {
        displayName: "Business",
        name: "business clothes",
        image: "/store/Business_Clothes.svg",
        cost: 100,
        description: "Create economic growth through innovation! ",
      },
      {
        displayName: "Painter",
        name: "painter clothes",
        image: "/store/Painter_Clothes.svg",
        cost: 100,
        description: "Create beautiful art using your imagination!",
      },
    ],
    accessories: [
      {
        itemName: "musician shoes",
        cost: 100,
      },
      {
        itemName: "astronaut shoes",
        cost: 100,
      },
      {
        itemName: "business shoes",
        cost: 100,
      },
      {
        itemName: "musician hat",
        cost: 100,
      },
      {
        itemName: "sunglasses",
        cost: 100,
      },
      {
        itemName: "business hat",
        cost: 100,
      },
      {
        itemName: "doctor hat",
        cost: 100,
      },
    ],
  };

  const tabData = [
    {
      title: "Clothes",
      image: "/store/Clothes.svg",
      content: (
        <StoreTabContent
          items={storeItems.clothes.filter(
            (item) =>
              !petBag?.some?.((bagItem) => bagItem.itemName == item.name),
          )}
          onSelectItem={setSelectedItem}
        />
      ),
    },
    {
      title: "Accessories",
      image: "/store/Accessories.svg",
      content: <div>Content for Tab 2</div>,
    },
    {
      title: "Backgrounds",
      image: "/store/Backgrounds.svg",
      content: <div>Content for Tab 2</div>,
    },
    {
      title: "Food",
      image: "/store/Food.svg",
      content: <div>Content for Tab 2</div>,
    },
  ];

  const purchaseItem = async () => {
    try {
      await StoreHTTPClient.purchaseItem(
        petData?._id as string,
        selectedItem?.name as string,
      );

      setPetData({
        ...(petData as Pet),
        coins: (petData?.coins || 0) - (selectedItem?.cost || 0),
      });

      setPetBag((prevBag) => [
        ...prevBag,
        {
          itemName: selectedItem?.name as string,
          petId: new Types.ObjectId(petData?._id),
        },
      ]);

      setShowPurchasedScreen(true);

      console.log("Item successfully purchased");
    } catch (error) {
      console.error("Error purchasing item", error);
    }
  };

  return (
    <AuthorizedRoute>
      {petData && petBag ? (
        <div
          className="flex relative"
          onClick={() => {
            if (showPurchasedScreen) {
              setShowPurchasedScreen(false);
              setSelectedItem(null);
            }
          }}
        >
          {showPurchasedScreen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="relative">
                <Image
                  src="/store/Buy_Message.svg"
                  alt="Purchase Successful"
                  width={1032}
                  height={606}
                  className="object-contain"
                />
                {selectedItem && selectedItem.image && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[32%]">
                    <Image
                      src={selectedItem.image}
                      alt={selectedItem.displayName}
                      width={150}
                      height={86}
                      className="object-contain mx-auto"
                    />
                    <div className="mt-[10px] font-quantico text-center text-black text-[36px] font-bold leading-none">
                      {selectedItem.displayName}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col w-[26%] h-screen p-4 bg-[#E6E8F9]">
            <div className="text-[64px] text-center font-bold text-icanBlue-300 font-quantico leading-none">
              {selectedItem ? selectedItem.displayName : "Select Item"}
            </div>
            <div className="text-4xl text-center text-icanBlue-300 font-quantico">
              {selectedItem
                ? selectedItem.description
                : "Click item to learn more!"}
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
                onClick={purchaseItem}
                disabled={!selectedItem || petData.coins < selectedItem.cost}
                className={`font-quantico ${selectedItem && petData.coins >= selectedItem.cost ? "hover:bg-icanGreen-200" : ""} px-6 py-6 mb-4 text-4xl font-bold text-white bg-icanBlue-300`}
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
