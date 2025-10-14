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

export default function FoodModal({ foods }: { foods: string[] }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { setSelectedFood } = useFood();

  const [clickedFood, setClickedFood] = useState<string>("");

  const baseImageUrl = "/foods";

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
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] overflow-hidden",
        header:
          "mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl items-center",
        body: "bg-icanBlue-100 grid gap-8 mobile:grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 largeDesktop:grid-cols-4 tiny:auto-rows-[90%] minimized:auto-rows-[90%] short:auto-rows-[60%] overflow-y-auto list-scrollbar",
        closeButton: "top-[2.75rem]",
        footer: "items-center justify-center",
      }}
      className="w-[80%] mobile:h-[70%] tablet:h-[65%] tiny:h-[80%] minimized:h-[75%] short:h-[70%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={() => {
        onClose();
        router.push("/");
      }}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Foods</ModalHeader>
        <ModalBody>
          {foods.map((food) => {
            return (
              <div
                key={food}
                className={`flex flex-col items-center justify-center gap-[0.625rem] justify-self-center h-full
                            ${food === clickedFood ? "cursor-pointer bg-icanGreen-300 border-[5px] border-solid border-black" : "hover:cursor-pointer hover:bg-icanGreen-300 hover:border-[5px] hover:border-solid hover:border-black"}`}
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
