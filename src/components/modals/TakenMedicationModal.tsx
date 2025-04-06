import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";

interface TakenModalProps {
  name: string;
  setChangeModalVisible: (visible: boolean) => void;
  handleTakenAction: () => void;
}

export default function MedicationTakenModal({
  name,
  setChangeModalVisible,
  handleTakenAction,
}: TakenModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleTakenLogic = () => {
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
      className="mobile:w-[70%] tablet:w-[65%] desktop:w-[60%] largeDesktop:w-[55%] h-fit font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="sm"
      placement="center"
      closeButton={<></>}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>{`Mark ${name} as Taken?`}</ModalHeader>
        <ModalBody>
          <div className="flex mobile:w-[70%] tablet:w-[50%] justify-between items-center largeDesktop:mb-4">
            <button
              onClick={handleClose}
              className="border-solid border-white border-2 font-bold px-4 py-2 mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl"
            >
              NO
            </button>
            <button
              onClick={handleTakenLogic}
              className="bg-icanGreen-100 text-black font-bold px-4 py-2 mobile:text-2xl tablet:text-3xl largeDesktop:text-4xl tiny:text-xl minimized:text-2xl small:text-3xl"
            >
              YES
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
