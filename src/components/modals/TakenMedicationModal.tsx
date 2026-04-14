import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";

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
  const handleTakenLogic = () => {
    handleTakenAction();
    handleClose();
  };

  const handleClose = () => {
    setChangeModalVisible(false);
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "max-w-[357px] rounded-none bg-[#565DAA] text-white shadow-none desktop:max-w-[600px] desktop:bg-icanBlue-200 desktop:text-[#a8b0d3]",
        header:
          "justify-center items-center text-center text-[32px] leading-none desktop:mobile:text-2xl desktop:tablet:text-3xl desktop:largeDesktop:text-4xl desktop:tiny:text-xl desktop:minimized:text-2xl desktop:small:text-3xl",
        body: "items-center justify-between",
      }}
      className="z-50 h-fit w-[calc(100vw-36px)] max-w-[357px] overflow-y-auto rounded-none px-6 py-8 font-quantico font-bold text-white outline-none desktop:mobile:w-[70%] desktop:tablet:w-[65%] desktop:desktop:w-[60%] desktop:largeDesktop:w-[55%]"
      isOpen={true}
      onClose={handleClose}
      radius="sm"
      placement="center"
      hideCloseButton={true}
      isDismissable={false}
    >
      <ModalContent>
        <ModalHeader>{`Mark ${name} as Taken?`}</ModalHeader>
        <ModalBody>
          <div className="flex w-full items-center justify-center gap-10 desktop:w-[50%] desktop:largeDesktop:mb-4">
            <button
              onClick={handleClose}
              className="border-2 border-solid border-white px-5 py-2 text-[32px] font-normal leading-none text-white"
            >
              NO
            </button>
            <button
              onClick={handleTakenLogic}
              className="bg-icanGreen-300 px-5 py-2 text-[32px] font-normal leading-none text-black"
            >
              YES
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
