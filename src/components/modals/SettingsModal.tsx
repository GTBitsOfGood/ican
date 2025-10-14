import React, { useEffect } from "react";
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
import { useUser } from "../UserContext";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import { useDeleteAccount, useLogout } from "../hooks/useAuth";
import Image from "next/image";

export default function SettingsModal() {
  const { userId } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const { data: settings, isLoading } = useSettings();
  const updateSettingsMutation = useUpdateSettings();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  // Ensures we only PATCH when user makes the change, not the initial load
  // We should eventually add debounce to this to prevent abuse
  const handleParentalControlsChange = (value: boolean) => {
    updateSettingsMutation.mutate({ parentalControl: value });
  };

  const handleNotificationsChange = (value: boolean) => {
    updateSettingsMutation.mutate({ notifications: value });
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    logoutMutation.mutate();
  };

  const handleDeleteAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteModalOpen();
  };

  const handleConfirmDelete = async () => {
    onDeleteModalClose();

    if (!userId) {
      console.error("UserId is null");
      return;
    }

    deleteAccountMutation.mutate(userId);
  };

  if (isLoading || !settings) {
    return null;
  }

  return (
    <>
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "bg-icanBlue-200 text-[#a8b0d3] w-[960px] max-w-[960px]",
          header: "text-5xl underline mb-4",
          closeButton: "right-[3rem] top-[3rem]",
        }}
        className="font-quantico font-bold z-50 border-8 border-[#7177AC] text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
        isOpen={isOpen}
        onClose={onClose}
        radius="lg"
        placement="center"
        closeButton={<ModalCloseButton onClose={onClose} />}
        size={"full"}
      >
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center w-[95%] text-[#1E2353] gap-10">
              <div className="flex w-full gap-8 border-8 border-[#7177AC] bg-[#B7BDEF] p-6">
                <div className="flex flex-col w-1/2 gap-7">
                  <div className="flex justify-between items-center pl-4">
                    <h5 className="text-3xl">Parental Control</h5>
                    <ModalSwitch
                      state={settings.parentalControl}
                      setState={handleParentalControlsChange}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <h5 className="text-3xl">Notifications</h5>
                    <ModalSwitch
                      state={settings.notifications}
                      setState={handleNotificationsChange}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {settings.parentalControl && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Logout</h5>
                    </div>
                    <ModalNextButton
                      link="settings"
                      onClick={handleLogout}
                      requirePin={settings.parentalControl}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-1/2 gap-7">
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {settings.parentalControl && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Medications</h5>
                    </div>
                    <ModalNextButton
                      link="medications"
                      requirePin={settings.parentalControl}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {settings.parentalControl && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Change Pin</h5>
                    </div>
                    <ModalNextButton
                      link="change-pin"
                      requirePin={settings.parentalControl}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {settings.parentalControl && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Delete Account</h5>
                    </div>
                    <ModalNextButton
                      link="settings"
                      onClick={handleDeleteAccount}
                      preventNavigation={true}
                      requirePin={settings.parentalControl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "bg-icanBlue-200 text-[#a8b0d3]",
        }}
        className="w-[50%] h-[30%] font-quantico z-[60] text-white p-6 rounded-none outline-none"
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        radius="lg"
        placement="center"
        closeButton={
          <div style={{ display: "none" }}>
            <ModalCloseButton onClose={onDeleteModalClose} />
          </div>
        }
      >
        <ModalContent>
          <ModalBody>
            <div className="w-full h-full flex-col bg-icanBlue-200">
              <div className="flex flex-row text-center font-bold text-3xl text-white">
                Are you sure you want to delete your account?
              </div>
              <div className="flex-row text-center text-1xl text-white gap-2">
                Once your account is deleted, the data cannot be restored.
              </div>
              <div className="flex w-1/2 justify-between mx-auto">
                <button
                  className="text-white text-3xl font-bold py-2 px-4 border-2 mt-4 mr-4"
                  onClick={onDeleteModalClose}
                >
                  NO
                </button>
                <button
                  className="bg-deleteRed text-white text-3xl font-bold py-2 px-4 border-2 border-deleteRed mr-4 mt-4"
                  onClick={handleConfirmDelete}
                >
                  YES
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
