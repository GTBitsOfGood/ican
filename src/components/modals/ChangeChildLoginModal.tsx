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
        base: "h-[100dvh] max-h-[100dvh] w-screen max-w-none rounded-none bg-[#565DAA] text-white shadow-none desktop:h-auto desktop:max-h-[650px] desktop:max-w-[840px] desktop:bg-icanBlue-200 desktop:text-[#a8b0d3]",
        header: "px-0 text-5xl",
      }}
      className="z-50 h-[100dvh] w-screen max-w-none rounded-none bg-[#565DAA] px-5 pb-8 pt-10 font-quantico font-bold text-white outline-none desktop:h-auto desktop:w-[60%] desktop:max-w-none desktop:bg-transparent desktop:px-6 desktop:py-8"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent className="h-full overflow-hidden desktop:h-auto">
        <ModalHeader className="justify-start px-0 text-left leading-[48px] tracking-[-0.08em] desktop:justify-start">
          Change Child Login
        </ModalHeader>
        <ModalBody className="overflow-y-auto px-0 pb-0">
          <div className="flex w-full flex-col gap-6">
            <p className="text-left text-[24px] font-normal leading-normal text-white desktop:text-xl">
              Select the child login type
            </p>
            {error && <p className="text-red-300">{error}</p>}
            <select
              value={childPasswordType}
              onChange={(e) => {
                setChildPasswordType(e.target.value as ChildPasswordType);
                setChildPassword("");
                setColorSequence([]);
                setError("");
              }}
              className="h-11 w-full border border-black bg-white px-6 text-[24px] font-normal text-black desktop:h-12 desktop:px-3 desktop:text-lg"
            >
              <option value={ChildPasswordType.NORMAL}>Pin</option>
              <option value={ChildPasswordType.COLOR}>Colors</option>
              <option value={ChildPasswordType.SHAPE}>Shapes</option>
              <option value={ChildPasswordType.EMOJI}>Emojis</option>
              <option value={ChildPasswordType.PATTERN}>Patterns</option>
            </select>

            {childPasswordType === ChildPasswordType.NORMAL ? (
              <>
                <p className="text-left text-[24px] font-normal leading-normal text-white desktop:text-white/80 desktop:text-lg">
                  Enter a new pin below
                </p>
                <InputOTP
                  maxLength={4}
                  value={childPassword}
                  onChange={(value) => {
                    setChildPassword(value);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="flex w-full justify-center"
                >
                  <InputOTPGroup className="flex items-center gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-16 w-16 rounded-[4px] border border-black/10 bg-tilePreviewBg text-4xl text-black first:rounded-[4px] first:border last:rounded-[4px] desktop:h-[120px] desktop:w-[120px] desktop:text-5xl"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </>
            ) : (
              <>
                <p className="text-2xl font-normal text-white desktop:hidden">
                  Choose the colors for your password below
                </p>
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
              className="mt-1 h-11 w-full bg-[#accc6e] px-4 py-3 text-center text-[18px] font-normal leading-none text-black desktop:mt-0 desktop:self-end desktop:w-auto desktop:p-2 desktop:text-xl desktop:font-bold desktop:bg-icanGreen-100"
            >
              Save
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
