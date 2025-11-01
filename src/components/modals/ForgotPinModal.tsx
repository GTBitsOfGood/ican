import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { useUser } from "../UserContext";
import ModalCloseButton from "./ModalCloseButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import AuthHTTPClient from "@/http/authHTTPClient";

export default function ForgotPinModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userId } = useUser();
  const [otp, setOTP] = useState<string>("");
  const [displayError, setDisplayError] = useState<string>("");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  //sends OTP
  useEffect(() => {
    (async () => {
      try {
        await AuthHTTPClient.forgotPassword({ userId: userId! });
      } catch (error) {
        setDisplayError((error as Error).message);
        return;
      }
    })();
  }, []);

  const handleClick = async () => {
    if (!userId) {
      setDisplayError("You must be logged in to perform this action");
      return;
    }
    if (otp.length < 4) {
      setDisplayError("ERROR: Pin must be 4 digits");
      return;
    }

    try {
      await AuthHTTPClient.verifyForgotPassword(userId, otp, true);
    } catch (error) {
      setDisplayError((error as Error).message);
      return;
    }

    window.location.href = "change-pin";
  };

  return (
    <Modal
      backdrop="opaque"
      classNames={{
        backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
        base: "bg-icanBlue-200 text-[#a8b0d3] max-w-[840px] max-h-[550px]",
        header: "text-5xl",
      }}
      className="w-[45%] font-quantico font-bold z-50 text-white py-8 px-6 overflow-y-hidden rounded-none outline-none"
      isOpen={isOpen}
      onClose={onClose}
      radius="lg"
      placement="center"
      closeButton={<ModalCloseButton onClose={onClose} />}
    >
      <ModalContent>
        <ModalHeader>Forgot Pin</ModalHeader>
        <ModalBody>
          <h1 className="text-xl">
            We have sent a one-time pin to your email. Enter it below to reset
            your pin.
          </h1>
          <div className="w-full h-[80%] flex flex-col gap-8 justify-between">
            <div className="w-full h-[80%] flex flex-col justify-center gap-4">
              {displayError && (
                <div className="flex gap-2 justify-center items-center">
                  <div className="flex justify-center items-center border-[1px] border-solid border-white font-pixelify w-[1rem] h-[1rem]">
                    <p>!</p>
                  </div>
                  <p className="text-center font-normal">{displayError}</p>
                </div>
              )}
              <div className="w-full flex justify-center items-center">
                <InputOTP
                  maxLength={4}
                  onChange={(newValue: string) => {
                    setDisplayError("");
                    setOTP(newValue);
                  }}
                  pattern={REGEXP_ONLY_DIGITS}
                  containerClassName="flex justify-between items-center w-full"
                >
                  <InputOTPGroup className="flex justify-between items-center w-full">
                    <InputOTPSlot
                      index={0}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={1}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={2}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                    <InputOTPSlot
                      index={3}
                      className={`mobile:w-[8vw] mobile:h-[8vw] desktop:w-[10vw] desktop:h-[10vw] border-black text-5xl text-black font-bold first:rounded-none last:rounded-none rounded-none ${displayError ? "bg-[#FFC3C3]" : "bg-white"}`}
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
            <button
              type="submit"
              onClick={handleClick}
              className={`self-end p-2 text-black text-xl ${displayError === "" ? "bg-icanGreen-100" : "bg-[#FFC3C3]"}`}
            >
              {displayError === "" ? "Enter" : "Try Again"}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
