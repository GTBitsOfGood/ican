import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";

export default function ForgotPinModal() {
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
        header: "text-5xl",
      }}
      className="w-[55%] mobile:h-[52.5%] tablet:h-[55%] desktop:h-[55.5%] largeDesktop:h-[60%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Forgot Pin</ModalHeader>
        <ModalBody>
          <h1>ForgotPinModal</h1>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
