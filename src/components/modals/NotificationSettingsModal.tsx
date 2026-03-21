import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import ModalSwitch from "./ModalSwitch";
import { useSettings, useUpdateSettings } from "../hooks/useSettings";
import {
  REGULAR_NOTIFICATION_TYPES,
  RegularNotificationType,
} from "@/utils/constants";

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_TYPE_LABELS: Record<RegularNotificationType, string> = {
  early: "Early Reminders",
  on_time: "On-Time Alerts",
  missed: "Missed Dose Alerts",
};

export default function NotificationSettingsModal({
  isOpen,
  onClose,
}: NotificationSettingsModalProps) {
  const { data: settings } = useSettings();
  const updateSettings = useUpdateSettings();

  const prefs = settings?.notificationPreferences;

  const updatePref = <K extends keyof NonNullable<typeof prefs>>(
    key: K,
    value: NonNullable<typeof prefs>[K],
  ) => {
    updateSettings.mutate({ notificationPreferences: { [key]: value } });
  };

  const toggleNotificationType = (type: RegularNotificationType) => {
    const currentTypes = prefs?.types ?? [...REGULAR_NOTIFICATION_TYPES];
    const next = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    updateSettings.mutate({ notificationPreferences: { types: next } });
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
      className="w-[80%] tablet:w-[55%] font-quantico font-bold z-[60] border-8 border-[var(--color-periwinkle)] text-white py-8 px-6 rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} link="#" />}
    >
      <ModalContent>
        <ModalHeader>Notifications</ModalHeader>
        <ModalBody>
          <div className="flex flex-col w-full text-[var(--color-navy)] gap-6 border-8 border-[var(--color-periwinkle)] bg-[var(--color-lavender)] p-6">
            <div className="flex flex-col gap-4">
              <h6 className="text-xl font-bold text-[var(--color-navy)] uppercase tracking-wide">
                Delivery
              </h6>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-2xl">In-App Notifications</h5>
                <ModalSwitch
                  state={prefs?.realTimeEnabled ?? true}
                  setState={(v) => updatePref("realTimeEnabled", v)}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-2xl">Email Notifications</h5>
                <ModalSwitch
                  state={prefs?.emailEnabled ?? true}
                  setState={(v) => updatePref("emailEnabled", v)}
                />
              </div>
            </div>

            <div className="border-t-2 border-[var(--color-periwinkle)]" />

            <div className="flex flex-col gap-4">
              <h6 className="text-xl font-bold text-[var(--color-navy)] uppercase tracking-wide">
                Notification Types
              </h6>
              {REGULAR_NOTIFICATION_TYPES.map((type) => (
                <div
                  key={type}
                  className="flex justify-between items-center pl-4"
                >
                  <h5 className="text-2xl">{NOTIFICATION_TYPE_LABELS[type]}</h5>
                  <ModalSwitch
                    state={prefs?.types?.includes(type) ?? true}
                    setState={() => toggleNotificationType(type)}
                  />
                </div>
              ))}
            </div>

            <div className="border-t-2 border-[var(--color-periwinkle)]" />

            <div className="flex flex-col gap-4">
              <h6 className="text-xl font-bold text-[var(--color-navy)] uppercase tracking-wide">
                Reminder Settings
              </h6>
              <div className="flex justify-between items-center pl-4 gap-4">
                <h5 className="text-2xl shrink-0">Early Reminder Window</h5>
                <EarlyWindowInput
                  value={prefs?.earlyWindow ?? 15}
                  onCommit={(v) => updatePref("earlyWindow", v)}
                />
              </div>
              <div className="flex justify-between items-center pl-4">
                <h5 className="text-2xl">24-Hour Time (e.g. 16:00)</h5>
                <ModalSwitch
                  state={prefs?.use24HourTime ?? false}
                  setState={(v) => updatePref("use24HourTime", v)}
                />
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function EarlyWindowInput({
  value,
  onCommit,
}: {
  value: number;
  onCommit: (v: number) => void;
}) {
  const [local, setLocal] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value, 10);
    if (!isNaN(v) && v >= 1 && v <= 60) {
      setLocal(v);
    }
  };

  const handleBlur = () => {
    if (local !== value) {
      onCommit(local);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        min={1}
        max={60}
        value={local}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-16 text-center text-[var(--color-navy)] bg-white border-2 border-[var(--color-periwinkle)] px-2 py-1 text-xl font-bold outline-none"
      />
      <span className="text-lg text-[var(--color-navy)]">min</span>
    </div>
  );
}
