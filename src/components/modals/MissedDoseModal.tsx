import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import ModalCloseButton from "./ModalCloseButton";

interface ChangePinModalProps {
  name: string;
  time: string;
  setMissedDoseVisible: (visible: boolean) => void;
}

export default function MissedDoseModal({
  name,
  time,
  setMissedDoseVisible,
}: ChangePinModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClose = () => {
    setMissedDoseVisible(false);
  };

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
      className="mobile:w-[70%] tablet:w-[65%] desktop:w-[60%] largeDesktop:w-[55%] h-fit font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      isDismissable={false}
      closeButton={<ModalCloseButton onClose={handleClose} link="/log" />}
    >
      <ModalContent>
        <ModalHeader>Missed Dose</ModalHeader>
        <ModalBody>
          <p className="font-normal mobile:text-lg tablet:text-xl largeDesktop:text-2xl tiny:text-md minimized:text-lg small:text-xl">
            You missed your {time} dose of {name}. Please remember to take your
            medication within the 30 minute window.
          </p>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
