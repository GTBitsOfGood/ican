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
import { settingService } from "@/http/settingService";
import { useUser } from "../UserContext";

export default function SettingsModal() {
  const { userId } = useUser();

  const { isOpen, onOpen, onClose: onCloseDefault } = useDisclosure();
  const [parentalControlsEnabled, setParentalControlsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [helpfulTipsEnabled, setHelpfulTipsEnabled] = useState(false);

  useEffect(() => {
    onOpen();

    if (userId) {
      settingService
        .getSettings(userId)
        .then((settings) => {
          setParentalControlsEnabled(settings.parentalControl);
          setNotificationsEnabled(settings.notifications);
          setHelpfulTipsEnabled(settings.helpfulTips);
        })
        .catch((error) => console.log(error));
    }
  }, [userId, onOpen]);

  const handleClose = () => {
    if (!userId) {
      // Don't know what to do in this instance, this just doesn't save it
      console.log("User is not signed in");
      onCloseDefault();
      return;
    }
    try {
      // No await as I don't want user waiting for the save to happen
      settingService
        .updateSettings(
          userId,
          parentalControlsEnabled,
          notificationsEnabled,
          helpfulTipsEnabled,
        )
        .then(() => {
          console.log("Settings saved successfully");
        })
        .catch((error) => {
          console.log("Error saving settings:", error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      onCloseDefault();
    }
  };

  return parentalControlsEnabled ? (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        header: "text-5xl underline mb-8",
        closeButton: "right-[3rem] top-[3rem]",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
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
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={setParentalControlsEnabled}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <ModalNextButton link="medications" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Change Pin</h5>
                <ModalNextButton link="change-pin" />
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
        header: "text-5xl underline mb-8",
        closeButton: "right-[3rem] top-[3rem]",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={handleClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={handleClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-16">
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
            <div className="flex flex-col w-full gap-8">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={setParentalControlsEnabled}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Medications</h5>
                <ModalNextButton link="medications" />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
