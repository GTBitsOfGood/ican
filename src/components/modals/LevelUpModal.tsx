import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import { useEffect } from "react";
import Image from "next/image";
import ExpBar from "../ui/ExpBar";

interface LevelUpModalProps {
  setVisible: (visible: boolean) => void;
  level: number | undefined;
  xp: number | undefined;
  levelChanged: boolean;
}

export default function FoodModal({
  setVisible,
  level,
  xp,
  levelChanged,
}: LevelUpModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] overflow-hidden max-w-[400px]",
        header:
          "mobile:text-3xl tablet:text-4xl largeDesktop:text-5xl tiny:text-2xl minimized:text-3xl small:text-4xl items-center",
        closeButton: "top-[2.5rem]",
        footer: "items-center justify-center",
      }}
      className="w-[60%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-hidden rounded-none outline-none"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <ModalHeader>
          {levelChanged ? "Level Up!" : "Congratulations!"}
        </ModalHeader>
        <ModalBody>
          {levelChanged ? (
            <div className="relative">
              <Image
                src="/misc/Banner.svg"
                width={0}
                height={0}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 450px"
                alt="Banner"
                className="absolute top-10 left-1/2 transform -translate-x-1/2 z-10 w-auto"
              />
              <div className="absolute desktop:top-16 tablet:top-16 mobile:top-24 tiny:top-12 short:top-14 left-1/2 transform -translate-x-1/2 z-10 text-white desktop:text-4xl tablet:text-3xl mobile:text-2xl tiny:text-2xl font-bold text-stroke-2 text-stroke-[#7B4200] text-shadow-[#A0632C] paint-stroke">
                Level {level ?? 0}
              </div>
              <Image
                src="/misc/Shine.svg"
                width={0}
                height={0}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 450px"
                alt="Shine"
                className="mx-auto mb-4 w-auto"
              />
              <div className="flex">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
                  <div className="flex items-center justify-center text-white desktop:text-5xl tablet:text-4xl mobile:text-3xl tiny:text-2xl font-bold space-x-2">
                    <span className="text-stroke-4 text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke">
                      +100
                    </span>
                    <Image
                      src="/icons/Coin-b.svg"
                      width={0}
                      height={0}
                      sizes="(max-width: 768px) 10vw, (max-width: 1200px) 8vw, 50px"
                      alt="Coin"
                      className="w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Image
                src="/assets/CongratulationsBackdrop.svg"
                width={0}
                height={0}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 450px"
                alt="Shine"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mx-auto mb-4 w-auto h-[60vh] tablet:h-[50vh] tiny:h-[55vh]"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-cente h-10">
                <ExpBar level={level ?? 0} currentExp={xp ?? 0} />
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
