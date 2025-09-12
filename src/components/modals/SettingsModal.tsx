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
import SettingsHTTPClient from "@/http/settingsHTTPClient";
import { useUser } from "../UserContext";
import AuthHTTPClient from "@/http/authHTTPClient";
import UserHTTPClient from "@/http/userHTTPClient";
import Image from "next/image";

export default function SettingsModal() {
  const { userId } = useUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [parentalControlsEnabled, setParentalControlsEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [helpfulTipsEnabled, setHelpfulTipsEnabled] = useState(false);
  const [settingsChanged, setSettingsChanged] = useState(false);

  useEffect(() => {
    onOpen();
    if (!userId) {
      return;
    }
    SettingsHTTPClient.getSettings(userId)
      .then((settings) => {
        setParentalControlsEnabled(settings.parentalControl);
        setNotificationsEnabled(settings.notifications);
        setHelpfulTipsEnabled(settings.helpfulTips);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userId, onOpen]);

  // Ensures we only PATCH when user makes the change, not the initial load
  // But its honestly way too many requests if a kid decides to toggle the button for fun
  const handleSettingChange =
    <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
    (value: React.SetStateAction<T>): void => {
      setter(value);
      setSettingsChanged(true);
    };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await AuthHTTPClient.logout();
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteAccount = async (
    e: React.MouseEvent<HTMLAnchorElement>,
  ) => {
    e.preventDefault();
    try {
      if (userId === null) {
        console.error("UserId is null");
        return;
      }
      await UserHTTPClient.deleteAccount(userId);
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!settingsChanged) {
      return;
    }
    if (!userId) {
      console.log("Save Unsuccessful: User is not signed in");
      return;
    }
    try {
      // Ignore waiting
      SettingsHTTPClient.updateSettings(
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
      console.log("Error saving settings:", error);
    }
  }, [
    parentalControlsEnabled,
    notificationsEnabled,
    helpfulTipsEnabled,
    settingsChanged,
    userId,
  ]);

  return parentalControlsEnabled ? (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        header: "text-5xl underline mb-4",
        closeButton: "right-[3rem] top-[3rem]",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-10">
            <div className="flex flex-col w-full gap-7">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <ModalSwitch
                  state={notificationsEnabled}
                  setState={handleSettingChange(setNotificationsEnabled)}
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
                  setState={handleSettingChange(setHelpfulTipsEnabled)}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex">
                  <Image
                    src={"store/Lock.svg"}
                    alt={"Locked"}
                    className="w-11 l-11 object-contain"
                    height={0}
                    width={0}
                  />
                  <h5 className="text-3xl">Logout</h5>
                </div>
                <ModalNextButton link="settings" onClick={handleLogout} />
              </div>
            </div>
            <div className="flex flex-col w-full gap-7">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={handleSettingChange(setParentalControlsEnabled)}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex">
                  <Image
                    src={"store/Lock.svg"}
                    alt={"Locked"}
                    className="w-11 l-11 object-contain"
                    height={0}
                    width={0}
                  />
                  <h5 className="text-3xl">Medications</h5>
                </div>
                <ModalNextButton link="medications" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex">
                  <Image
                    src={"store/Lock.svg"}
                    alt={"Locked"}
                    className="w-11 l-11 object-contain"
                    height={0}
                    width={0}
                  />
                  <h5 className="text-3xl">Change Pin</h5>
                </div>
                <ModalNextButton link="change-pin" />
              </div>
              <div className="flex justify-between items-center pl-4">
                <div className="flex">
                  <Image
                    src={"store/Lock.svg"}
                    alt={"Locked"}
                    className="w-11 l-11 object-contain"
                    height={0}
                    width={0}
                  />
                  <h5 className="text-3xl">Delete Account</h5>
                </div>
                <ModalNextButton
                  link="settings"
                  onClick={handleDeleteAccount}
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
        header: "text-5xl underline mb-4",
        closeButton: "right-[3rem] top-[3rem]",
      }}
      className="w-[70%] h-[90%] font-quantico font-bold z-50 text-white pt-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Settings</ModalHeader>
        <ModalBody>
          <div className="flex flex-col items-center w-[95%] gap-10">
            <div className="flex flex-col w-full gap-7">
              <h3 className="font-bold text-5xl">General</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Notifications</h5>
                <ModalSwitch
                  state={notificationsEnabled}
                  setState={handleSettingChange(setNotificationsEnabled)}
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
                  setState={handleSettingChange(setHelpfulTipsEnabled)}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Logout</h5>
                <ModalNextButton link="settings" onClick={handleLogout} />
              </div>
            </div>
            <div className="flex flex-col w-full gap-7">
              <h3 className="font-bold text-5xl">Parental</h3>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-3xl">Parental Controls</h5>
                <ModalSwitch
                  state={parentalControlsEnabled}
                  setState={handleSettingChange(setParentalControlsEnabled)}
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
