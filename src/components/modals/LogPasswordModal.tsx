import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
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
import Link from "next/link";

type LogPasswordType = {
  handleNext: () => void;
  setPin: Dispatch<SetStateAction<string>>;
};

export default function LogPasswordModal({
  handleNext,
  setPin,
}: LogPasswordType) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleClick = async () => {
    try {
      handleNext();
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
      closeButton={<ModalCloseButton onClose={onClose} link="/log" />}
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
                    setPin(newValue);
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
              <Link className="inline-block size-fit" href="forgot-pin">
                <button className="bg-white p-2 text-black text-xl">
                  Forgot Pin?
                </button>
              </Link>
            </div>
            <button
              type="submit"
              onClick={handleClick}
              className={`self-end p-2 text-black text-xl bg-white`}
            >
              {error === "" ? "Enter" : "Try Again"}
            </button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
