import React, { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from "../UserContext";
import SettingsHTTPClient from "@/http/settingsHTTPClient";

type LogPasswordType = {
  isOpen: boolean;
  onClose: () => void;
  handleNext?: (
    e?: React.MouseEvent<HTMLButtonElement>,
  ) => void | Promise<void>;
  link?: string;
};

export default function LogPasswordModal({
  isOpen,
  onClose,
  handleNext,
  link,
}: LogPasswordType) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const { userId } = useUser();
  const [pin, setPin] = useState<string>("");

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (pin.length < 4) {
      setError("ERROR: Pin must be 4 digits");
      return;
    }
    if (!userId) {
      setError("You must be logged in to perform this action");
      return;
    }

    try {
      await SettingsHTTPClient.validatePin(userId, pin);
      if (handleNext) {
        e.preventDefault();
        await handleNext(e);
      } else if (link) {
        await router.push(link);
      }
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setError(`Error: ${error.message}`);
      } else {
        setError(`Unexpected error occured.`);
      }
    }
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[840px]",
        header: "text-5xl",
      }}
      className="z-50 w-[calc(100vw-34px)] max-w-[360px] rounded-none bg-[#565DAA] px-[30px] pb-9 pt-[64px] font-quantico font-bold text-white outline-none desktop:w-[85%] desktop:max-w-[840px] desktop:bg-icanBlue-200 desktop:px-6 desktop:py-8 desktop:text-white"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader className="justify-center text-center desktop:justify-start desktop:text-left">
          Enter Pin
        </ModalHeader>
        <ModalBody>
          <div className="flex h-[80%] w-full flex-col justify-between gap-6 pt-1 desktop:gap-8">
            <div className="flex h-[80%] w-full flex-col justify-center gap-5">
              {error && (
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center border-[1px] border-solid border-white font-pixelify w-[1rem] h-[1rem]">
                    <p>!</p>
                  </div>
                  <p className="text-center font-normal">{error}</p>
                </div>
              )}
              <div className="flex w-full justify-center items-center">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setPin(newValue);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="flex w-full justify-center items-center desktop:justify-between"
                >
                  <InputOTPGroup className="flex w-full max-w-[280px] items-center justify-between gap-[6px] desktop:max-w-none desktop:gap-0 desktop:justify-between">
                    <InputOTPSlot
                      index={0}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={1}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={2}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={3}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Link
                className="inline-block size-fit self-center desktop:self-start"
                href="/forgot-pin"
              >
                <button className="text-xl underline desktop:bg-white desktop:p-2 desktop:text-black desktop:no-underline">
                  Forget Password?
                </button>
              </Link>
            </div>
            <div className="self-center border border-lime-600 border-r-[2.5px] border-b-[2.5px] bg-lime-100 px-1.5 desktop:self-end desktop:border-0 desktop:bg-white desktop:p-2">
              <button
                className="flex h-full w-full items-center justify-center px-2 py-2 text-lg leading-4 text-black desktop:px-0 desktop:py-0 desktop:text-xl"
                onClick={handleClick}
              >
                {error === "" ? "Enter" : "Try Again"}
              </button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
