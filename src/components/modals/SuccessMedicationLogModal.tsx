import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import ModalCloseButton from "./ModalCloseButton";
import Image from "next/image";

export default function SuccessMedicationModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        header:
          "mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl justify-center items-center",
        body: "items-center justify-between",
      }}
      className="mobile:w-[70%] tablet:w-[65%] desktop:w-[60%] largeDesktop:w-[45%] h-fit font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      isDismissable={false}
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Medication Logged Successfully</ModalHeader>
        <ModalBody>
          <div className="flex justify-center items-center">
            <Image
              src={"/misc/SuccessPizza.svg"}
              alt=""
              width={200}
              height={200}
            />
          </div>
          <div className="flex justify-center text-center text-3xl font-medium font-pixelify">
            Congratulations! You have earned food to feed your pet!
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
