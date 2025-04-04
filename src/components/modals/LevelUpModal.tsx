import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import { useEffect } from "react";

interface LevelUpModalProps {
  setVisible: (visible: boolean) => void;
}

export default function FoodModal({ setVisible }: LevelUpModalProps) {
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
        base: "bg-icanBlue-200 text-[#a8b0d3] overflow-hidden",
        header:
          "mobile:text-3xl tablet:text-4xl largeDesktop:text-5xl tiny:text-2xl minimized:text-2xl small:text-4xl items-center",
        closeButton: "top-[2.5rem]",
        footer: "items-center justify-center",
      }}
      className="w-[60%] mobile:h-[70%] tablet:h-[65%] tiny:h-[75%] minimized:h-[67.5%] short:h-[50%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={handleClose} />}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>Level Up!</ModalHeader>
        <ModalBody></ModalBody>
      </ModalContent>
    </Modal>
  );
}
