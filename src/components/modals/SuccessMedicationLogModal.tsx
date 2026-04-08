import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useEffect } from "react";
import Image from "next/image";
import ModalCloseButton from "./ModalCloseButton";
import {
  InjectionIcon,
  LiquidIcon,
  PillIcon,
} from "../ui/modals/medicationIcons";

interface SuccessMedicationModalProps {
  onModalClose?: () => void;
  medicationType?: "Pill" | "Syrup" | "Shot";
  message?: string;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
}

export default function SuccessMedicationModal({
  onModalClose,
  medicationType = "Pill",
  message = "You have gained medicine to give to your pet!",
  title = "Medication Logged Successfully",
  imageSrc,
  imageAlt = "",
}: SuccessMedicationModalProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onModalClose?.();
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [onModalClose]);

  const handleClose = () => {
    if (onModalClose) {
      onModalClose();
    }
  };

  const rewardIcon = imageSrc ? (
    <Image
      src={imageSrc}
      alt={imageAlt}
      width={200}
      height={200}
      className="h-28 w-28 object-contain desktop:h-[200px] desktop:w-[200px]"
    />
  ) : medicationType === "Syrup" ? (
    <LiquidIcon className="h-28 w-28 desktop:h-[200px] desktop:w-[200px]" />
  ) : medicationType === "Shot" ? (
    <InjectionIcon className="h-28 w-28 desktop:h-[200px] desktop:w-[200px]" />
  ) : (
    <PillIcon className="h-28 w-28 desktop:h-[200px] desktop:w-[200px]" />
  );

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "max-w-[357px] rounded-none bg-[#565DAA] text-white shadow-none desktop:max-w-[840px] desktop:bg-icanBlue-200 desktop:text-[#a8b0d3]",
        header:
          "justify-center items-center text-center text-[32px] leading-none desktop:mobile:text-2xl desktop:tablet:text-3xl desktop:largeDesktop:text-4xl desktop:tiny:text-xl desktop:minimized:text-2xl desktop:small:text-3xl",
        body: "items-center justify-between",
      }}
      className="z-50 h-fit w-[calc(100vw-36px)] max-w-[357px] overflow-y-auto rounded-none px-6 py-8 font-quantico font-bold text-white outline-none desktop:mobile:w-[70%] desktop:tablet:w-[65%] desktop:desktop:w-[60%] desktop:largeDesktop:w-[50%]"
      isOpen={true}
      onClose={handleClose}
      radius="lg"
      placement="center"
      isDismissable={true}
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <div className="flex justify-center items-center">{rewardIcon}</div>
          <div className="flex justify-center px-5 text-center font-mono text-[15px] font-medium leading-6 desktop:px-0 desktop:text-3xl desktop:font-quantico">
            {message}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
