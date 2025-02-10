import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";

interface SettingsModalProps {
  isParent: boolean;
}

interface CheckboxProps {
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CloseButtonProps {
  onClose: () => void;
}

function Checkbox({ state, setState }: CheckboxProps) {
  return (
    <div className="flex w-[9.5%] p-2 border-2 border-white justify-around items-center">
      <div
        className={`cursor-pointer w-6 h-6 ${state ? "bg-icanGreen-300" : "bg-icanBlue-100"} `}
        onClick={() => setState(!state)}
      ></div>
      <p className="text-lg">{state ? "ON" : "OFF"}</p>
    </div>
  );
}

function NextButton() {
  return (
    <a
      className="flex bg-white w-[9.5%] p-2 justify-center items-stretch"
      href="medications"
    >
      <button className="w-full h-full flex justify-center items-center">
        <svg
          fill="black"
          className="w-8 h-8"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          {" "}
          <path
            d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
            fill="black"
          />{" "}
        </svg>
      </button>
    </a>
  );
}

function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button
      onClick={onClose}
      className="absolute right-[1rem] top-[1rem] font-pixelify font-normal text-6xl rounded-full w-12 h-12 hover:bg-white/5 active:bg-white/10 "
    >
      <p className="relative bottom-3">x</p>
    </button>
  );
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
      closeButton={<CloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <NextButton />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Change Pin</h5>
                <NextButton />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <Checkbox
                  state={parentalControlsEnabled}
                  setState={setParentalControlsEnabled}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <Checkbox
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
                <Checkbox
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
      closeButton={<CloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <NextButton />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <Checkbox
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
                <Checkbox
                  state={helpfulTipsEnabled}
                  setState={setHelpfulTipsEnabled}
                />
              </div>
            </div>
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <Checkbox
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
