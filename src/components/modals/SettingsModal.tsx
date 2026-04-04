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
import LogPasswordModal from "./LogPasswordModal";
import NotificationSettingsModal from "./NotificationSettingsModal";
import { useUser } from "../UserContext";
import {
  useSettings,
  useUpdatePin,
  useUpdateSettings,
} from "../hooks/useSettings";
import { useDeleteAccount, useLogout } from "../hooks/useAuth";
import Image from "next/image";
import { useRouter } from "next/router";

export default function SettingsModal() {
  const { userId } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure();
  const {
    isOpen: isPinModalOpen,
    onOpen: onPinModalOpen,
    onClose: onPinModalClose,
  } = useDisclosure();
  const {
    isOpen: isNotifModalOpen,
    onOpen: onNotifModalOpen,
    onClose: onNotifModalClose,
  } = useDisclosure();
  const {
    isOpen: isPinForNotifModalOpen,
    onOpen: onPinForNotifModalOpen,
    onClose: onPinForNotifModalClose,
  } = useDisclosure();
  const { data: settings, isLoading } = useSettings();
  const updatePinMutation = useUpdatePin();
  const updateSettings = useUpdateSettings();
  const logoutMutation = useLogout();
  const deleteAccountMutation = useDeleteAccount();
  const router = useRouter();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClose = () => {
    onClose();
    router.push("/");
  };

  const handleParentalControlsChange = (value: boolean) => {
    if (value) {
      router.push("/change-pin");
    } else {
      onPinModalOpen();
    }
  };

  const handleDisableParentalControls = async () => {
    updatePinMutation.mutate(null);
    onPinModalClose();
  };

  const handleNotificationsClick = () => {
    if (settings?.pin) {
      onPinForNotifModalOpen();
    } else {
      onNotifModalOpen();
    }
  };

  const handlePinVerifiedForNotif = () => {
    onPinForNotifModalClose();
    onNotifModalOpen();
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
          base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[1080px]",
          header: "text-5xl underline mb-4",
          closeButton: "right-[3rem] top-[3rem]",
        }}
        className="w-[80%] font-quantico font-bold z-50 border-8 border-[#7177AC] text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
        isOpen={isOpen}
        onClose={handleClose}
        radius="lg"
        placement="center"
        closeButton={<ModalCloseButton onClose={handleClose} />}
      >
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center w-[95%] text-[#1E2353] gap-10">
              <div className="flex flex-col items-center desktop:flex-row w-full gap-8 border-8 border-[#7177AC] bg-[#B7BDEF] p-6 overflow-y-auto max-h-[50vh]">
                <div className="flex flex-col w-full md:w-1/2 gap-7">
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Notifications</h5>
                    </div>
                    <div
                      className="flex bg-white w-[26%] p-2 justify-center items-stretch cursor-pointer"
                      onClick={handleNotificationsClick}
                    >
                      <svg
                        fill="black"
                        className="w-8 h-8"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
                          fill="black"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
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
                      requirePin={!!settings.pin}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <h5 className="text-3xl">24-Hour Time</h5>
                    <ModalSwitch
                      state={
                        settings?.notificationPreferences?.use24HourTime ??
                        false
                      }
                      setState={(v) =>
                        updateSettings.mutate({
                          notificationPreferences: { use24HourTime: v },
                        })
                      }
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <h5 className="text-3xl">Parental Control</h5>
                    <ModalSwitch
                      state={!!settings.pin}
                      setState={handleParentalControlsChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col w-full md:w-1/2 gap-7">
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
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
                      requirePin={!!settings.pin}
                      disabled={!settings.pin}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
                        <Image
                          src="/store/Lock.svg"
                          alt="Locked"
                          className="w-8 h-8 object-contain"
                          height={32}
                          width={32}
                        />
                      )}
                      <h5 className="text-3xl">Child Login</h5>
                    </div>
                    <ModalNextButton
                      link="change-child-login"
                      requirePin={!!settings.pin}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
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
                      requirePin={!!settings.pin}
                      preventNavigation={true}
                    />
                  </div>
                  <div className="flex justify-between items-center pl-4">
                    <div className="flex items-center gap-2">
                      {!!settings.pin && (
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
                      requirePin={!!settings.pin}
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
          base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[500px] max-h-[600px]",
        }}
        className="w-[50%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-hidden rounded-none outline-none"
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

      {isPinModalOpen && (
        <LogPasswordModal
          isOpen={isPinModalOpen}
          onClose={onPinModalClose}
          handleNext={handleDisableParentalControls}
        />
      )}

      {isPinForNotifModalOpen && (
        <LogPasswordModal
          isOpen={isPinForNotifModalOpen}
          onClose={onPinForNotifModalClose}
          handleNext={handlePinVerifiedForNotif}
        />
      )}

      <NotificationSettingsModal
        isOpen={isNotifModalOpen}
        onClose={onNotifModalClose}
      />
    </>
  );
}
