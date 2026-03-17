import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import ModalCloseButton from "./ModalCloseButton";
import {
  InjectionIcon,
  LiquidIcon,
  PillIcon,
} from "../ui/modals/medicationIcons";

interface SuccessMedicationModalProps {
  onModalClose?: () => void;
  medicationType?: "Pill" | "Syrup" | "Shot";
}

export default function SuccessMedicationModal({
  onModalClose,
  medicationType = "Pill",
}: SuccessMedicationModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClose = () => {
    onClose();
    if (onModalClose) {
      onModalClose();
    }
  };

  const medicationIcon =
    medicationType === "Syrup" ? (
      <LiquidIcon className="h-[200px] w-[200px]" />
    ) : medicationType === "Shot" ? (
      <InjectionIcon className="h-[200px] w-[200px]" />
    ) : (
      <PillIcon className="h-[200px] w-[200px]" />
    );

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[840px]",
        header:
          "mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl justify-center items-center",
        body: "items-center justify-between",
      }}
      className="mobile:w-[70%] tablet:w-[65%] desktop:w-[60%] largeDesktop:w-[50%] h-fit font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      isDismissable={false}
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <ModalHeader>Medication Logged Successfully</ModalHeader>
        <ModalBody>
          <div className="flex justify-center items-center">
            {medicationIcon}
          </div>
          <div className="flex justify-center text-center text-3xl font-medium font-quantico">
            You have gained medicine to give to your pet!
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
