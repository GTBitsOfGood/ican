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
import { usePet } from "../hooks/usePet";
import { cn } from "@/lib/utils";

export default function FoodModal({ foods }: { foods: string[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { setSelectedFood } = useFood();
  const { data: pet } = usePet();

  const [clickedFood, setClickedFood] = useState<string>("");

  const baseImageUrl = "/foods";
  const totalFood = pet?.food ?? 0;

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
        base: "bg-icanBlue-200 text-[#a8b0d3] overflow-hidden",
        header:
          "mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl items-start",
        body: "bg-icanBlue-100 grid gap-4 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4 largeDesktop:grid-cols-4 minimized:auto-rows-[90%] short:auto-rows-[60%] overflow-y-auto list-scrollbar",
        closeButton: "top-[2.75rem]",
        footer: "items-center justify-center",
      }}
      className="mobile:h-[70%] tablet:h-[65%] tiny:h-[80%] minimized:h-[75%] short:h-[70%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-4 px-0">
          <h3 className="underline underline-offset-4 text-4xl">Foods</h3>
          <div className="flex items-center gap-3 bg-white px-4 py-2 border-4 border-black">
            <Image
              src={`${baseImageUrl}/Pizza.svg`}
              alt={"food"}
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-black text-xl font-bold">
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
                  "flex flex-col items-center justify-center gap-2 px-6 py-6 justify-self-center h-full border-4 border-icanBlue-100 hover:cursor-pointer hover:bg-icanGreen-300 hover:border-solid hover:border-black",
                  food === clickedFood &&
                    "cursor-pointer bg-icanGreen-300 border-4 border-solid border-black",
                )}
                onClick={() => setClickedFood(food)}
              >
                <Image
                  src={`${baseImageUrl}/${food}.svg`}
                  alt={food}
                  width={200}
                  height={200}
                  className="h-full w-auto object-contain"
                  priority
                />
                <p className="text-black text-lg font-bold text-center capitalize mt-2">
                  {food}
                </p>
              </div>
            );
          })}
        </ModalBody>
        <ModalFooter>
          <button
            onClick={handleSelectFood}
            className="text-2xl font-bold bg-icanGreen-200 text-black px-4 py-2"
          >
            Select
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
