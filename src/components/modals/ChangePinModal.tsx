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

  const OTPStyles = {
    border: "#000",
    width: "12vw",
    height: "12vw",
    fontSize: "44px",
    color: "#000",
    backgroundColor: error ? "#FFC3C3" : "#FFF",
    fontWeight: "700",
    borderRadius: "0px",
  };

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
        closeButton:
          "hover:bg-white/5 active:bg-white/10 right-[1.5rem] rounded-full top-[0.75rem] absolute",
        header: "text-5xl mb-8",
      }}
      className="w-[55%] h-[50%] font-quantico font-bold z-50 text-white px-4"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Enter Pin</ModalHeader>
        <ModalBody>
          <div className="w-full h-[50%] flex flex-col gap-16">
            <div className="w-full h-full flex flex-col justify-center gap-4">
              {error && <p className="text-center font-normal">{error}</p>}
              <div className="w-full flex">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setOldPin(newValue);
                    setError("");
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                >
                  <InputOTPGroup style={{ gap: "1.25rem" }}>
                    <InputOTPSlot index={0} style={OTPStyles} />
                    <InputOTPSlot index={1} style={OTPStyles} />
                    <InputOTPSlot index={2} style={OTPStyles} />
                    <InputOTPSlot index={3} style={OTPStyles} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <a href="forgot-pin">
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
