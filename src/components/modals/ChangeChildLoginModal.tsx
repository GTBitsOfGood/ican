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
import { ChildPasswordType } from "@/types/user";
import { useUpdateChildLogin } from "../hooks/useSettings";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";

export default function ChangeChildLoginModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const updateChildLogin = useUpdateChildLogin();
  const [childPasswordType, setChildPasswordType] = useState<ChildPasswordType>(
    ChildPasswordType.NORMAL,
  );
  const [childPassword, setChildPassword] = useState<string>("");
  const [confirmChildPassword, setConfirmChildPassword] = useState<string>("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [error, setError] = useState<string>("");

  const candidatePassword =
    childPasswordType === ChildPasswordType.COLOR
      ? colorSequence.join("-")
      : childPassword.trim();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleSave = () => {
    if (candidatePassword.length < 3) {
      setError("Child password must be at least 3 characters.");
      return;
    }

    if (
      childPasswordType === ChildPasswordType.NORMAL &&
      candidatePassword !== confirmChildPassword.trim()
    ) {
      setError("Child passwords don't match.");
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
                setConfirmChildPassword("");
                setColorSequence([]);
                setError("");
              }}
              className="h-12 px-3 text-black text-lg"
            >
              <option value={ChildPasswordType.NORMAL}>Normal</option>
              <option value={ChildPasswordType.COLOR}>Color Pattern</option>
            </select>

            {childPasswordType === ChildPasswordType.NORMAL ? (
              <>
                <input
                  type="password"
                  value={childPassword}
                  onChange={(e) => {
                    setChildPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Child password"
                  className="h-12 px-3 text-black text-lg"
                />
                <input
                  type="password"
                  value={confirmChildPassword}
                  onChange={(e) => {
                    setConfirmChildPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm child password"
                  className="h-12 px-3 text-black text-lg"
                />
              </>
            ) : (
              <>
                <ChildColorPicker
                  sequence={colorSequence}
                  onAddColor={(token) => {
                    setColorSequence((prev) => [...prev, token]);
                    setError("");
                  }}
                  onClear={() => {
                    setColorSequence([]);
                    setError("");
                  }}
                  theme="dark"
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
