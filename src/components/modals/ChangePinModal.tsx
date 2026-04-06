import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import ModalCloseButton from "./ModalCloseButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "next/router";
import { useUpdatePin } from "../hooks/useSettings";

export default function ChangePinModal() {
  const updatePinMutation = useUpdatePin();
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPin, setOldPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  // Currently only updates pin, the logic here should be changed in the future
  const handleClick = async () => {
    if (oldPin.length < 4) {
      setError("ERROR: Pin must be 4 digits");
      return;
    }

    updatePinMutation.mutate(oldPin, {
      onSuccess: () => {
        console.log("Pin successfully changed");
        router.push("/");
      },
      onError: (error) => {
        if (error instanceof Error) {
          setError(`Error: ${error.message}`);
        } else {
          setError(`Unexpected error occurred.`);
        }
      },
    });
  };

  const displayError =
    error ||
    (updatePinMutation.error
      ? `Error: ${updatePinMutation.error.message}`
      : "");

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "max-w-[360px] rounded-none bg-[#565DAA] text-white shadow-none desktop:max-w-[840px] desktop:max-h-[550px] desktop:bg-icanBlue-200 desktop:text-[#a8b0d3]",
        header: "px-0 text-3xl desktop:text-5xl",
      }}
      className="z-50 w-[calc(100vw-34px)] max-w-[360px] overflow-y-hidden rounded-none bg-[#565DAA] px-[30px] pb-9 pt-[64px] font-quantico font-bold text-white outline-none desktop:w-[85%] desktop:max-w-none desktop:bg-transparent desktop:px-6 desktop:py-8"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader className="justify-center text-center desktop:justify-start desktop:text-left">
          Change Pin
        </ModalHeader>
        <ModalBody>
          <h1 className="text-center text-lg desktop:text-left desktop:text-xl">
            Enter the new pin you would like to change to
          </h1>
          <div className="flex h-[80%] w-full flex-col justify-between gap-6 pt-1 desktop:gap-8">
            <div className="flex h-[80%] w-full flex-col justify-center gap-5">
              {displayError && (
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center border-[1px] border-solid border-white font-pixelify w-[1rem] h-[1rem]">
                    <p>!</p>
                  </div>
                  <p className="text-center font-normal">{displayError}</p>
                </div>
              )}
              <div className="flex w-full items-center justify-center">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setOldPin(newValue);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="flex w-full items-center justify-center desktop:justify-between"
                >
                  <InputOTPGroup className="flex w-full max-w-[280px] items-center justify-between gap-[6px] desktop:max-w-none desktop:gap-0 desktop:justify-between">
                    <InputOTPSlot
                      index={0}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl font-bold text-black first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={1}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl font-bold text-black first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={2}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl font-bold text-black first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={3}
                      className={`h-16 w-16 border-[0.35px] border-black text-5xl font-bold text-black first:rounded-none last:rounded-none rounded-none desktop:h-[10vw] desktop:w-[10vw] ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <div className="self-center border border-lime-600 border-r-[2.5px] border-b-[2.5px] bg-lime-100 px-1.5 desktop:self-end desktop:border-0 desktop:bg-white desktop:p-2">
              <button
                type="submit"
                onClick={handleClick}
                className={`flex h-full w-full items-center justify-center px-2 py-2 text-lg leading-4 text-black desktop:px-0 desktop:py-0 desktop:text-xl ${displayError === "" ? "" : ""}`}
              >
                {displayError === "" ? "Enter" : "Try Again"}
              </button>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
