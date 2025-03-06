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
import SettingsHTTPClient from "@/http/settingsHTTPClient";
import { useUser } from "../UserContext";

export default function ChangePinModal() {
  const { userId } = useUser();

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
    if (!userId) {
      setError("You must be logged in to perform this action");
      return;
    }
    try {
      await SettingsHTTPClient.updatePin(userId, oldPin);
      console.log("Pin successfully changed");
      // What to do upon successful submission?
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
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        header: "text-5xl",
      }}
      className="w-[55%] mobile:h-[52.5%] tablet:h-[55%] desktop:h-[55.5%] largeDesktop:h-[60%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Enter Pin</ModalHeader>
        <ModalBody>
          <div className="w-full h-[80%] flex flex-col gap-8 justify-between">
            <div className="w-full h-[80%] flex flex-col justify-center gap-4">
              {error && (
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center border-[1px] border-solid border-white font-pixelify w-[1rem] h-[1rem]">
                    <p>!</p>
                  </div>
                  <p className="text-center font-normal">{error}</p>
                </div>
              )}
              <div className="w-full flex justify-center items-center">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setOldPin(newValue);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="flex justify-between items-center w-full"
                >
                  <InputOTPGroup className="flex justify-between items-center w-full">
                    <InputOTPSlot
                      index={0}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={1}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={2}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={3}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${error ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <a className="inline-block size-fit" href="forgot-pin">
                <button className="bg-white p-2 text-black text-xl">
                  Forgot Pin?
                </button>
              </a>
            </div>
            <button
              type="submit"
              onClick={handleClick}
              className={`self-end p-2 text-black text-xl ${error === "" ? "bg-icanGreen-100" : "bg-[#FFC3C3]"}`}
            >
              {error === "" ? "Enter" : "Try Again"}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
