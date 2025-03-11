import Image from "next/image";
import { useRouter } from "next/router";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import { useEffect, useState } from "react";
import InventoryTabs from "@/components/ui/InventoryTabs";
import InventoryTabContent, {
  StoreItem,
} from "@/components/ui/InventoryTabContent";
import StoreHTTPClient from "@/http/storeHTTPClient";
import { BagItem } from "@/db/models";
import { Types } from "mongoose";
import { AccessoryType, ItemType } from "@/types/store";
import InventoryLeftPanel from "@/components/ui/InventoryLeftPanel";

export default function Store() {
  const router = useRouter();
  const { userId } = useUser();
  const [petData, setPetData] = useState<Pet | null>(null);
  const [petBag, setPetBag] = useState<BagItem[]>([]);
  const [showPurchasedScreen, setShowPurchasedScreen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);

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
        type: ItemType.CLOTHES,
        image: "/store/clothes/Cool_Shirt.svg",
        cost: 100,
        level: 0,
        description: "Cool shirt",
      },
      {
        displayName: "Scrubs",
        name: "doctor clothes",
        type: ItemType.CLOTHES,
        image: "/store/clothes/Doctor.svg",
        cost: 100,
        level: 0,
        description: "Help save lives as a doctor or nurse!",
      },
      {
        displayName: "Astronaut",
        name: "astronaut clothes",
        type: ItemType.CLOTHES,
        image: "/store/clothes/Astronaut.svg",
        cost: 100,
        level: 0,
        description: "Explore the planets and galaxies with this spacesuit!",
      },
      {
        displayName: "Business",
        name: "business clothes",
        type: ItemType.CLOTHES,
        image: "/store/clothes/Business.svg",
        cost: 100,
        level: 0,
        description: "Create economic growth through innovation!",
      },
      {
        displayName: "Painter",
        name: "painter clothes",
        type: ItemType.CLOTHES,
        image: "/store/clothes/Painter.svg",
        cost: 100,
        level: 0,
        description: "Create beautiful art using your imagination!",
      },
      {
        displayName: "Future Item",
        name: "future item",
        type: ItemType.CLOTHES,
        image: "",
        cost: 100,
        level: 2,
        description: "",
      },
      {
        displayName: "Locked",
        name: "blah blah",
        type: ItemType.CLOTHES,
        image: "",
        cost: 100,
        level: 2,
        description: "",
      },
    ],
    accessories: [
      {
        displayName: "Musician Shoes",
        name: "musician shoes",
        type: AccessoryType.SHOES,
        image: "/store/shoes/Musician.svg",
        cost: 100,
        level: 0,
        description: "Musician...",
      },
      {
        displayName: "Astronaut Shoes",
        name: "astronaut shoes",
        type: AccessoryType.SHOES,
        image: "/store/shoes/Astronaut.svg",
        cost: 100,
        level: 0,
        description: "Explore the planets and galaxies with this spacesuit!",
      },
      {
        displayName: "Business Shoes",
        name: "business shoes",
        type: AccessoryType.SHOES,
        image: "/store/shoes/Business.svg",
        cost: 100,
        level: 0,
        description: "Create economic growth through innovation!",
      },
      {
        displayName: "Musician Hat",
        name: "musician hat",
        type: AccessoryType.HAT,
        image: "/store/hats/Musician.svg",
        cost: 100,
        level: 0,
        description: "Musician...",
      },
      {
        displayName: "Business Hat",
        name: "business hat",
        type: AccessoryType.HAT,
        image: "/store/hats/Business.svg",
        cost: 100,
        level: 0,
        description: "Create economic growth through innovation!",
      },
      {
        displayName: "Doctor Hat",
        name: "doctor hat",
        type: AccessoryType.HAT,
        image: "/store/hats/Doctor.svg",
        cost: 100,
        level: 0,
        description: "Help save lives as a doctor or nurse!",
      },
      {
        displayName: "First Aid",
        name: "doctor accessory",
        type: AccessoryType.OCCUPATION,
        image: "/store/occupation/Doctor.svg",
        cost: 100,
        level: 2,
        description: "Help save lives as a doctor or nurse!",
      },
      {
        displayName: "Briefcase",
        name: "business accessory",
        type: AccessoryType.OCCUPATION,
        image: "/store/occupation/Business.svg",
        cost: 100,
        level: 2,
        description: "Create economic growth through innovation!",
      },
    ],
    backgrounds: [
      {
        displayName: "Apple Tree",
        name: "apple tree",
        type: ItemType.BACKGROUND,
        image: "/store/backgrounds/Apple_Tree.svg",
        cost: 100,
        level: 0,
        description: "Enjoy a sunny day with yummy apples!",
      },
    ],
    foods: [
      {
        displayName: "Pizza",
        name: "pizza",
        type: ItemType.FOOD,
        image: "/store/foods/Pizza.svg",
        cost: 100,
        level: 0,
        description: "Pizza...",
      },
      {
        displayName: "Avocado",
        name: "avocado",
        type: ItemType.FOOD,
        image: "/store/foods/Avocado.svg",
        cost: 100,
        level: 0,
        description: "A fresh avocado...",
      },
      {
        displayName: "Bread",
        name: "bread",
        type: ItemType.FOOD,
        image: "/store/foods/Bread.svg",
        cost: 100,
        level: 0,
        description: "A loaf of bread...",
      },
      {
        displayName: "Burger",
        name: "burger",
        type: ItemType.FOOD,
        image: "/store/foods/Burger.svg",
        cost: 100,
        level: 0,
        description: "A delicious burger...",
      },
      {
        displayName: "Cupcake",
        name: "cupcake",
        type: ItemType.FOOD,
        image: "/store/foods/Cupcake.svg",
        cost: 100,
        level: 0,
        description: "A sweet cupcake...",
      },
      {
        displayName: "Egg",
        name: "egg",
        type: ItemType.FOOD,
        image: "/store/foods/Egg.svg",
        cost: 100,
        level: 2,
        description: "A single egg...",
      },
      {
        displayName: "Fries",
        name: "fries",
        type: ItemType.FOOD,
        image: "/store/foods/Fries.svg",
        cost: 100,
        level: 2,
        description: "Crispy fries...",
      },
      {
        displayName: "Lemonade",
        name: "lemonade",
        type: ItemType.FOOD,
        image: "/store/foods/Lemonade.svg",
        cost: 100,
        level: 2,
        description: "Refreshing lemonade...",
      },
    ],
  };

  const tabData = [
    {
      title: "Clothes",
      image: "/store/categories/Clothes.svg",
      content: (
        <InventoryTabContent
          items={storeItems.clothes.filter(
            (item) =>
              !petBag?.some?.((bagItem) => bagItem.itemName == item.name),
          )}
          petLevel={petData?.xpLevel as number}
          onSelectItem={setSelectedItem}
        />
      ),
    },
    {
      title: "Accessories",
      image: "/store/categories/Accessories.svg",
      content: (
        <InventoryTabContent
          items={storeItems.accessories.filter(
            (item) =>
              !petBag?.some?.((bagItem) => bagItem.itemName == item.name),
          )}
          petLevel={petData?.xpLevel as number}
          onSelectItem={setSelectedItem}
        />
      ),
    },
    {
      title: "Backgrounds",
      image: "/store/categories/Backgrounds.svg",
      content: (
        <InventoryTabContent
          items={storeItems.backgrounds.filter(
            (item) =>
              !petBag?.some?.((bagItem) => bagItem.itemName == item.name),
          )}
          petLevel={petData?.xpLevel as number}
          onSelectItem={setSelectedItem}
        />
      ),
    },
    {
      title: "Food",
      image: "/store/categories/Food.svg",
      content: (
        <InventoryTabContent
          items={storeItems.foods.filter(
            (item) =>
              !petBag?.some?.((bagItem) => bagItem.itemName == item.name),
          )}
          petLevel={petData?.xpLevel as number}
          onSelectItem={setSelectedItem}
        />
      ),
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
          <div className="w-[26%]">
            <InventoryLeftPanel
              petData={petData}
              selectedItem={selectedItem}
              button={
                <button
                  onClick={purchaseItem}
                  disabled={!selectedItem || petData.coins < selectedItem.cost}
                  className={`font-quantico ${selectedItem && petData.coins >= selectedItem.cost ? "hover:bg-icanGreen-200" : ""} px-6 py-6 mb-4 text-4xl font-bold text-white bg-icanBlue-300`}
                  type="button"
                >
                  Purchase
                </button>
              }
            />
          </div>
          <div className="w-[74%] h-screen bg-[#4C539B]">
            <div className="flex justify-between items-center">
              <div className="flex justify-center ml-[31px] p-2 mt-[40px] font-quantico text-black font-bold text-center text-4xl bg-[#E6E8F9] border-[3px] border-black">
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
              <InventoryTabs
                tabs={tabData}
                onSelectTab={() => setSelectedItem(null)}
              />
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
