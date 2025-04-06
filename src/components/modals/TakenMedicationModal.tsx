import { Medication } from "@/db/models/medication";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";

interface TakenModalProps {
  medication: Medication;
  setChangeModalVisible: (visible: boolean) => void;
  handleTakenAction: () => void;
}

export default function MedicationTakenModal({
  medication,
  setChangeModalVisible,
  handleTakenAction,
}: TakenModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleDeleteClick = () => {
    handleTakenAction();
    handleClose();
  };

  const handleClose = () => {
    setChangeModalVisible(false);
    onClose();
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
      className="mobile:w-[70%] tablet:w-[65%] desktop:w-[60%] largeDesktop:w-[55%] mobile:h-[40%] tablet:h-[35%] tiny:h-[75%] minimized:h-[67.5%] short:h-[50%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<></>}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>{`Mark ${medication.medicationId} as Taken?`}</ModalHeader>
        <ModalBody>
          <p className="font-normal mobile:text-lg tablet:text-xl largeDesktop:text-2xl tiny:text-md minimized:text-lg small:text-xl">
            Once a medication has been deleted, the data cannot be restored.
          </p>
          <div className="flex mobile:w-[70%] tablet:w-[50%] justify-between items-center largeDesktop:mb-4">
            <button
              onClick={handleClose}
              className="border-solid border-white border-2 font-bold px-4 py-2 mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl"
            >
              NO
            </button>
            <button
              onClick={handleDeleteClick}
              className="bg-icanGreen-100 font-bold px-4 py-2 mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl"
            >
              YES
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
