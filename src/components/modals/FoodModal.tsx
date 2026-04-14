import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import Image from "next/image";
import ModalCloseButton from "./ModalCloseButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useFood } from "../FoodContext";
import { cn } from "@/lib/utils";

export default function FoodModal({
  foods,
  foodCount,
}: {
  foods: string[];
  foodCount?: number;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { setSelectedFood } = useFood();

  const [clickedFood, setClickedFood] = useState<string>("");

  const baseImageUrl = "/foods";
  const totalFood = foodCount ?? foods.length;
  const handleClose = () => {
    onClose();
    router.push("/");
  };

  const handleSelectFood = () => {
    setSelectedFood(clickedFood);
    router.push("/");
  };

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal
      backdrop="opaque"
      size="lg"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "overflow-hidden rounded-none bg-icanBlue-200 text-[#a8b0d3] mobile:h-screen mobile:w-screen mobile:max-w-none mobile:max-h-none desktop:w-[70%] desktop:h-[70%] desktop:max-w-[960px] desktop:max-h-[720px]",
        header: "mb-4 text-5xl mobile:mb-0 desktop:underline",
        body: "overflow-y-auto mobile:bg-transparent desktop:grid desktop:bg-icanBlue-100 desktop:gap-8 desktop:grid-cols-3 desktop:largeDesktop:grid-cols-4 desktop:tiny:auto-rows-[90%] desktop:minimized:auto-rows-[90%] desktop:short:auto-rows-[60%] desktop:list-scrollbar",
        closeButton: "top-[2.75rem]",
        footer: "hidden items-center justify-center desktop:flex",
      }}
      className="z-50 overflow-y-auto rounded-none px-0 py-0 font-quantico font-bold text-white outline-none desktop:px-6 desktop:py-8"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      isDismissable={true}
      shouldCloseOnInteractOutside={() => true}
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <div className="mobile:flex relative min-h-screen flex-col bg-icanBlue-200 desktop:hidden">
          <ModalHeader className="flex flex-col items-start gap-2 px-[26px] pt-6">
            <div className="flex w-80 items-center gap-2">
              <h3 className="text-4xl leading-10 text-white">Foods</h3>
            </div>
            <div className="inline-flex items-center justify-center gap-[5px] border-2 border-black bg-[#E6E8F9] p-2">
              <Image
                src={`${baseImageUrl}/pizza.svg`}
                alt="food"
                width={48}
                height={48}
                className="h-12 w-12 object-contain"
              />
              <span className="text-2xl font-bold leading-6 text-black">
                Food: {totalFood} Left
              </span>
            </div>
          </ModalHeader>

          <ModalBody className="px-[26px] pb-[85px] pt-6">
            <div className="relative overflow-hidden border border-white bg-[#8D93C5] px-4 pb-8 pt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                {foods.map((food) => (
                  <button
                    key={food}
                    type="button"
                    className={cn(
                      "flex min-h-[172px] flex-col items-center justify-start gap-3 p-5 text-black",
                      food === clickedFood &&
                        "border-[2.39px] border-black bg-icanGreen-200",
                    )}
                    onClick={() => setClickedFood(food)}
                  >
                    <Image
                      src={`${baseImageUrl}/${food.toLowerCase()}.svg`}
                      alt={food}
                      width={96}
                      height={96}
                      className="h-24 w-24 object-contain"
                      priority
                    />
                    <span className="text-center text-xl font-bold capitalize">
                      {food}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </ModalBody>

          <div className="absolute bottom-[29px] left-[25px] right-[25px]">
            <button
              type="button"
              onClick={handleSelectFood}
              disabled={!clickedFood}
              className="relative h-12 w-full disabled:cursor-default disabled:grayscale-[0.35] disabled:opacity-80"
            >
              <span className="absolute inset-0 border-2 border-[#45531F]/40 bg-[linear-gradient(180deg,#B9D66F_0%,#7F9B3A_100%)] shadow-[0px_0px_0px_0.9px_rgba(61,112,201,0.4),inset_0px_0.9px_0.45px_0px_rgba(0,0,0,0.25)]" />
              <span className="absolute left-[20px] top-[5px] h-10 w-[calc(100%-40px)] border-2 border-[#8C9D5D]/40 bg-[linear-gradient(180deg,#B8D86E_0%,#88A43F_100%)] shadow-[inset_0px_1.8px_0px_0px_rgba(206,224,160,1)]" />
              <span className="absolute inset-0 z-10 flex items-center justify-center font-quantico text-3xl font-bold leading-7 text-white text-stroke-2 text-stroke-[#798C3F]">
                SELECT
              </span>
            </button>
          </div>
        </div>

        <div className="hidden desktop:block">
          <ModalHeader className="flex items-center gap-4 px-0">
            <h3 className="text-4xl underline underline-offset-4">Foods</h3>
            <div className="flex items-center gap-3 border-4 border-black bg-white px-4 py-2">
              <Image
                src={`${baseImageUrl}/pizza.svg`}
                alt={"food"}
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold text-black">
                Food: {totalFood} Left
              </span>
            </div>
          </ModalHeader>
          <ModalBody>
            {foods.map((food) => {
              return (
                <div
                  key={food}
                  className={cn(
                    "flex h-full flex-col items-center justify-center justify-self-center gap-2 border-4 border-icanBlue-100 px-6 py-6 hover:cursor-pointer hover:border-solid hover:border-black hover:bg-icanGreen-300",
                    food === clickedFood &&
                      "cursor-pointer border-4 border-solid border-black bg-icanGreen-300",
                  )}
                  onClick={() => setClickedFood(food)}
                >
                  <Image
                    src={`${baseImageUrl}/${food.toLowerCase()}.svg`}
                    alt={food}
                    width={200}
                    height={200}
                    className="h-full w-auto object-contain"
                    priority
                  />
                  <p className="mt-2 text-center text-lg font-bold capitalize text-black">
                    {food}
                  </p>
                </div>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <button
              onClick={handleSelectFood}
              className="bg-icanGreen-200 px-4 py-2 text-2xl font-bold text-black"
            >
              Select
            </button>
          </ModalFooter>
        </div>
      </ModalContent>
    </Modal>
  );
}
