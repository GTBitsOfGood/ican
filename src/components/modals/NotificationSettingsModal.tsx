import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import ModalSwitch from "./ModalSwitch";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSettingsModal({
  isOpen,
  onClose,
}: NotificationSettingsModalProps) {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const prefs = settings?.notificationPreferences;

  const updatePref = (
    key: "realTimeEnabled" | "emailEnabled",
    value: boolean,
  ) => {
    updateSettings.mutate({ notificationPreferences: { [key]: value } });
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[500px]",
        header: "text-5xl underline mb-4",
        closeButton: "right-[3rem] top-[3rem]",
      }}
      className="w-[80%] tablet:w-[50%] font-quantico font-bold z-[60] border-8 border-[#7177AC] text-white py-8 px-6 rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} link="#" />}
    >
      <ModalContent>
        <ModalHeader>Notifications</ModalHeader>
        <ModalBody>
          <div className="flex flex-col w-full text-[#1E2353] gap-6 border-8 border-[#7177AC] bg-[#B7BDEF] p-6">
            <div className="flex justify-between items-center pl-4">
              <h5 className="text-3xl">In-App Notifications</h5>
              <ModalSwitch
                state={prefs?.realTimeEnabled ?? true}
                setState={(v) => updatePref("realTimeEnabled", v)}
              />
            </div>
            <div className="flex justify-between items-center pl-4">
              <h5 className="text-3xl">Email Notifications</h5>
              <ModalSwitch
                state={prefs?.emailEnabled ?? true}
                setState={(v) => updatePref("emailEnabled", v)}
              />
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
