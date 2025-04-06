import { Modal, ModalBody, ModalContent, useDisclosure } from "@heroui/react";
import { useEffect } from "react";
import Image from "next/image";
import ExpBar from "../ui/ExpBar";
interface SuccessModalProps {
  setVisible: (visible: boolean) => void;
  xp: number | undefined;
  level: number | undefined;
}

export default function SuccessModal({
  setVisible,
  xp,
  level,
}: SuccessModalProps) {
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
      isOpen={isOpen}
      onClick={handleClose}
      className="w-[60%] mobile:h-[70%] tablet:h-[65%] tiny:h-[75%] minimized:h-[67.5%] short:h-[60%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      radius="lg"
      placement="center"
    >
      <ModalContent>
        <ModalBody>
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <Image
                src="/assets/CongratulationsBackdrop.svg"
                width={0}
                height={0}
                sizes="(max-width: 768px) 60vw, (max-width: 1200px) 50vw, 450px"
                alt="Shine"
                className="mx-auto mb-4 w-auto h-[60vh] tablet:h-[50vh] tiny:h-[55vh]"
              />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-cente h-10">
                <ExpBar level={level ? level : 1} currentExp={xp ? xp : 0} />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
