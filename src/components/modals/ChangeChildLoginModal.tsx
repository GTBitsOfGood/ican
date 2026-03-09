import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/router";
import ModalCloseButton from "./ModalCloseButton";
import { ChildPasswordType, isPatternChildPasswordType } from "@/types/user";
import { useUpdateChildLogin } from "../hooks/useSettings";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export default function ChangeChildLoginModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const updateChildLogin = useUpdateChildLogin();
  const [childPasswordType, setChildPasswordType] = useState<ChildPasswordType>(
    ChildPasswordType.COLOR,
  );
  const [childPassword, setChildPassword] = useState<string>("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const candidatePassword = isPatternChildPasswordType(childPasswordType)
    ? colorSequence.join("-")
    : childPassword.trim();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleSave = () => {
    if (
      isPatternChildPasswordType(childPasswordType) &&
      colorSequence.length < 4
    ) {
      setError("Please enter 4 selections.");
      return;
    }

    if (
      childPasswordType === ChildPasswordType.NORMAL &&
      !/^\d{4}$/.test(candidatePassword)
    ) {
      setError("Please enter a valid 4-digit PIN.");
      return;
    }

    updateChildLogin.mutate(
      {
        childPassword: candidatePassword,
        childPasswordType,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          setError(
            error instanceof Error
              ? `Error: ${error.message}`
              : "Unexpected error occurred.",
          );
        },
      },
    );
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[840px] max-h-[650px]",
        header: "text-5xl",
      }}
      className="w-[60%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Change Child Login</ModalHeader>
        <ModalBody>
          <div className="w-full flex flex-col gap-4">
            <p className="text-xl">Update the child password and login type.</p>
            {error && <p className="text-red-300">{error}</p>}
            <select
              value={childPasswordType}
              onChange={(e) => {
                setChildPasswordType(e.target.value as ChildPasswordType);
                setChildPassword("");
                setColorSequence([]);
                setError("");
              }}
              className="h-12 px-3 text-black text-lg"
            >
              <option value={ChildPasswordType.NORMAL}>Pin</option>
              <option value={ChildPasswordType.COLOR}>Color</option>
              <option value={ChildPasswordType.SHAPE}>Shape</option>
              <option value={ChildPasswordType.EMOJI}>Emoji</option>
              <option value={ChildPasswordType.PATTERN}>Pattern</option>
            </select>

            {childPasswordType === ChildPasswordType.NORMAL ? (
              <>
                <p className="text-white/80 text-lg">Enter a new pin below</p>
                <InputOTP
                  maxLength={4}
                  value={childPassword}
                  onChange={(value) => {
                    setChildPassword(value);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup className="flex items-center gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-[120px] w-[120px] rounded-[4px] border border-black/10 bg-tilePreviewBg text-5xl text-black first:rounded-[4px] first:border last:rounded-[4px]"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </>
            ) : (
              <>
                <ChildColorPicker
                  sequence={colorSequence}
                  onAddColor={(token) => {
                    setColorSequence((prev) =>
                      prev.length >= 4 ? prev : [...prev, token],
                    );
                    setError("");
                  }}
                  onRemoveColor={(token) => {
                    setColorSequence((prev) => {
                      const index = prev.lastIndexOf(token);
                      if (index === -1) return prev;
                      return [
                        ...prev.slice(0, index),
                        ...prev.slice(index + 1),
                      ];
                    });
                    setError("");
                  }}
                  onClear={() => {
                    setColorSequence([]);
                    setError("");
                  }}
                  view="change"
                  passwordType={childPasswordType}
                />
              </>
            )}

            <button
              type="button"
              onClick={handleSave}
              className="self-end p-2 text-black text-xl bg-icanGreen-100"
            >
              Save
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
