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

export default function SettingsModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [oldPin, setOldPin] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClick = () => {
    if (oldPin.length < 4) {
      setError("ERROR: Wrong Pin");
    }
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3]",
        header: "text-5xl mb-4",
      }}
      className="w-[55%] mobile:h-[45%] tablet:h-[47.5%] desktop:h-[50%] largeDesktop:h-[55%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-auto"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Enter Pin</ModalHeader>
        <ModalBody>
          <div className="w-full h-full flex flex-col gap-12 justify-between">
            <div className="w-full h-full flex flex-col justify-center gap-4">
              {error && <p className="text-center font-normal">{error}</p>}
              <div className="w-full flex justify-center items-center">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setOldPin(newValue);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup style={{ gap: "1.25rem" }}>
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
              className={`self-end p-2 mr-4 text-black text-xl ${error === "" ? "bg-icanGreen-100" : "bg-[#FFC3C3]"}`}
            >
              {error === "" ? "Enter" : "Try Again"}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
