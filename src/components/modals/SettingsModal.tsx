import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import ModalSwitch from "./ModalSwitch";
import ModalNextButton from "./ModalNextButton";

interface SettingsModalProps {
  isParent: boolean;
}

export default function SettingsModal({ isParent }: SettingsModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parentalControlsEnabled, setParentalControlsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [helpfulTipsEnabled, setHelpfulTipsEnabled] = useState(false);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return isParent ? (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        closeButton:
          "hover:bg-white/5 active:bg-white/10 right-[1.5rem] rounded-full top-[0.75rem] absolute",
        header: "text-5xl underline mb-8",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white px-4"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <ModalNextButton link="medications" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Change Pin</h5>
                <ModalNextButton link="change-pin" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={setParentalControlsEnabled}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <ModalSwitch
                  state={notificationsEnabled}
                  setState={setNotificationsEnabled}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex items-center">
                  <h5 className="text-3xl pr-2">Helpful Tips</h5>
                  <div className="flex justify-center items-center border-[1px] border-white w-[1.75rem] h-[1.75rem]">
                    <p className="text-2xl font-pixelify font-normal">?</p>
                  </div>
                </div>
                <ModalSwitch
                  state={helpfulTipsEnabled}
                  setState={setHelpfulTipsEnabled}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  ) : (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        closeButton:
          "hover:bg-white/5 active:bg-white/10 right-[1.5rem] rounded-full top-[0.75rem] absolute",
        header: "text-5xl underline mb-8",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white px-4"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <ModalNextButton link="medications" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <ModalSwitch
                  state={notificationsEnabled}
                  setState={setNotificationsEnabled}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex items-center">
                  <h5 className="text-3xl pr-2">Helpful Tips</h5>
                  <div className="flex justify-center items-center border-[1px] border-white w-[1.75rem] h-[1.75rem]">
                    <p className="text-2xl font-pixelify font-normal">?</p>
                  </div>
                </div>
                <ModalSwitch
                  state={helpfulTipsEnabled}
                  setState={setHelpfulTipsEnabled}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={setParentalControlsEnabled}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
