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

type ProtectedAction = {
  link?: string;
  onExecute?: () => void | Promise<void>;
};

function MobileSettingsToggle({
  state,
  onToggle,
  onLabel = "ON",
  offLabel = "OFF",
}: {
  state: boolean;
  onToggle: () => void;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex h-[37px] w-[84px] shrink-0 items-center justify-center gap-2 overflow-hidden border border-white px-[6px] py-[3px] shadow-[0px_2.38px_2.38px_0px_rgba(0,0,0,0.25)]"
    >
      {state ? (
        <>
          <span className="text-center text-[18px] font-normal leading-none text-white">
            {onLabel}
          </span>
          <span className="h-[18px] w-[18px] bg-lime-400" />
        </>
      ) : (
        <>
          <span className="h-[18px] w-[18px] bg-[#7d83b2]" />
          <span className="text-center text-[18px] font-normal leading-none text-white">
            {offLabel}
          </span>
        </>
      )}
    </button>
  );
}

function MobileSettingsRow({
  label,
  onClick,
  locked = false,
}: {
  label: string;
  onClick: () => void;
  locked?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[72px] w-full items-center justify-between border-t-[3px] border-[#4c539b] bg-[#b7bdef] px-4 py-2.5"
    >
      <div className="flex min-w-0 items-center gap-2">
        {locked && (
          <Image
            src="/store/Lock.svg"
            alt="Locked"
            width={24}
            height={24}
            className="h-6 w-6 shrink-0 object-contain"
          />
        )}
        <span className="min-w-0 text-left text-[20px] font-bold leading-[0.95] tracking-[-0.04em] text-black">
          {label}
        </span>
      </div>
      <span className="ml-3 flex h-[48px] w-[72px] shrink-0 items-center justify-center bg-white">
        <svg
          fill="black"
          className="h-7 w-7"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M4 11v2h12v2h2v-2h2v-2h-2V9h-2v2H4zm10-4h2v2h-2V7zm0 0h-2V5h2v2zm0 10h2v-2h-2v2zm0 0h-2v2h2v-2z"
            fill="black"
          />
        </svg>
      </span>
    </button>
  );
}

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
  const [mobileAction, setMobileAction] =
    React.useState<ProtectedAction | null>(null);

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleDeleteAccount = () => {
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

  const openProtectedAction = (action: ProtectedAction) => {
    if (settings.pin) {
      setMobileAction(action);
      return;
    }
    if (action.onExecute) {
      void action.onExecute();
      return;
    }
    if (action.link) {
      router.push(action.link);
    }
  };

  return (
    <>
      {mobileAction && (
        <LogPasswordModal
          isOpen={true}
          onClose={() => setMobileAction(null)}
          handleNext={async () => {
            if (mobileAction.onExecute) {
              await mobileAction.onExecute();
            } else if (mobileAction.link) {
              router.push(mobileAction.link);
            }
            setMobileAction(null);
          }}
          link={mobileAction.link}
        />
      )}
      <Modal
        backdrop="opaque"
        classNames={{
          backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
          base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[1080px]",
          header: "text-5xl underline mb-4",
          closeButton: "right-[3rem] top-[3rem]",
        }}
        className="z-50 h-screen w-screen max-h-[100dvh] rounded-none bg-[#565DAA] px-[15px] pb-6 pt-[39px] font-quantico font-bold text-white outline-none desktop:h-auto desktop:w-[80%] desktop:max-h-none desktop:border-8 desktop:border-[#7177AC] desktop:bg-icanBlue-200 desktop:px-6 desktop:py-8"
        isOpen={isOpen}
        onClose={handleClose}
        radius="lg"
        placement="center"
        closeButton={<ModalCloseButton onClose={handleClose} />}
      >
        <ModalContent>
          <ModalHeader className="hidden desktop:flex">Settings</ModalHeader>
          <ModalBody>
            <div className="desktop:hidden flex w-full flex-col items-center gap-7 overflow-y-auto pb-8">
              <div className="w-full text-center text-5xl font-bold leading-[48px] tracking-[-0.08em] text-white [text-shadow:-2px_7px_0px_rgba(43,47,88,1),0px_4px_0px_rgba(125,131,178,1)]">
                Settings
              </div>
              <div className="grid w-full grid-cols-[1fr_auto] items-center gap-6 px-7">
                <div className="text-center text-[19px] font-bold leading-none tracking-[-0.04em] whitespace-nowrap text-white">
                  Parental Control
                </div>
                <MobileSettingsToggle
                  state={!!settings.pin}
                  onToggle={() => handleParentalControlsChange(!settings.pin)}
                />
              </div>
              <div className="flex w-full flex-col items-start gap-5">
                <div className="w-full text-[30px] font-bold leading-none tracking-[-0.08em] text-white">
                  General
                </div>
                <div className="flex w-full flex-col items-start overflow-hidden border-[5px] border-[#7d83b2] bg-[#b7bdef]">
                  <div className="flex h-[72px] w-full items-center justify-between px-4">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="min-w-0 text-[20px] font-bold leading-[0.95] tracking-[-0.04em] text-black">
                        Helpful Tips
                      </span>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center border border-black font-pixelify text-[19px] font-normal leading-none text-black">
                        ?
                      </span>
                    </div>
                    <MobileSettingsToggle
                      state={!!settings.helpfulTips}
                      onToggle={() =>
                        updateSettings.mutate({
                          helpfulTips: !settings.helpfulTips,
                        })
                      }
                    />
                  </div>
                  <MobileSettingsRow
                    label="Notifications"
                    locked={!!settings.pin}
                    onClick={handleNotificationsClick}
                  />
                  <MobileSettingsRow
                    label="Medications"
                    locked={!!settings.pin}
                    onClick={() =>
                      openProtectedAction({ link: "/medications" })
                    }
                  />
                  <MobileSettingsRow
                    label="Change Pin"
                    locked={!!settings.pin}
                    onClick={() => openProtectedAction({ link: "/change-pin" })}
                  />
                  <MobileSettingsRow
                    label="Child Login"
                    locked={!!settings.pin}
                    onClick={() =>
                      openProtectedAction({ link: "/change-child-login" })
                    }
                  />
                  <MobileSettingsRow
                    label="Log Out"
                    locked={!!settings.pin}
                    onClick={() =>
                      openProtectedAction({
                        onExecute: handleLogout,
                      })
                    }
                  />
                  <MobileSettingsRow
                    label="Delete Account"
                    locked={!!settings.pin}
                    onClick={() =>
                      openProtectedAction({
                        onExecute: handleDeleteAccount,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="hidden desktop:flex flex-col items-center w-[95%] text-[#1E2353] gap-10">
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
                      link="/medications"
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
                      link="/change-pin"
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
                      link="/change-child-login"
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
                      link="/settings"
                      onClick={(e) => {
                        if (e) {
                          e.preventDefault();
                        }
                        handleLogout();
                      }}
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
                      link="/settings"
                      onClick={(e) => {
                        if (e) {
                          e.preventDefault();
                        }
                        handleDeleteAccount();
                      }}
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
