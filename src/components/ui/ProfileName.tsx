import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { useUpdatePetName, usePet } from "../hooks/usePet";

const ProfileName: React.FC = () => {
  const { data: pet } = usePet();
  const updatePetNameMutation = useUpdatePetName();

  const [isEditing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentName = pet?.name || "";

  const toggleEditing = async () => {
    if (isEditing) {
      if (editingName.trim() === "") {
        alert("Name cannot be empty");
        setEditingName(currentName);
        return;
      }

      if (editingName.trim() !== currentName) {
        updatePetNameMutation.mutate(editingName.trim(), {
          onSuccess: () => {
            console.log("Pet data updated successfully");
          },
          onError: (error) => {
            console.error("Error updating pet data:", error);
            alert("Failed to update pet name. Please try again.");
          },
        });
      }
    } else {
      setEditingName(currentName);
    }
    setEditing((prev) => !prev);
  };

  const cancelEditing = useCallback(() => {
    setEditingName(currentName);
    setEditing(false);
  }, [currentName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(
        editingName.length,
        editingName.length,
      );
    }
  }, [isEditing, editingName.length]);

  const displayName = isEditing ? editingName : currentName;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        cancelEditing();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        cancelEditing();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isEditing, cancelEditing]);

  return (
    <div
      ref={profileRef}
      className="relative flex h-[38px] w-full min-w-0 flex-row items-center desktop:inline-flex desktop:h-[56px] desktop:w-auto"
    >
      <input
        className={`
          text-4xl 4xl:text-4xl font-quantico font-bold bg-transparent text-white
          w-auto min-w-[4rem] max-w-full overflow-hidden text-ellipsis whitespace-nowrap
          ${
            !isEditing
              ? "focus:outline-none focus:ring-0 focus:border-none pointer-events-none select-none border-none max-w-[calc(100%-32px)] desktop:max-w-full"
              : "animate-pulse outline-dashed outline-white outline-2 max-w-[calc(100%-56px)] desktop:max-w-full"
          }
        `}
        type="text"
        ref={inputRef}
        value={displayName}
        readOnly={!isEditing || updatePetNameMutation.isPending}
        onChange={(e) => setEditingName(e.target.value)}
        maxLength={20}
        style={{ width: `${Math.max(displayName.length || 3, 3)}ch` }}
      />

      <button
        type="button"
        className={`relative ml-1 inline-block h-3/5 w-fit shrink-0 ${
          updatePetNameMutation.isPending ? "cursor-not-allowed opacity-50" : ""
        }`}
        onClick={toggleEditing}
        disabled={updatePetNameMutation.isPending}
      >
        {isEditing ? (
          <Image
            src="/misc/CheckMark.svg"
            alt="Confirm edit"
            width={40}
            height={40}
            draggable={false}
            className="h-full aspect-square object-contain select-none"
          />
        ) : (
          <Image
            src="/icons/Edit.svg"
            alt="Edit"
            width={34}
            height={34}
            draggable={false}
            className="h-full aspect-square object-contain select-none"
          />
        )}
      </button>

      {isEditing && (
        <button
          type="button"
          className="relative inline-block h-3/5 w-fit shrink-0"
          onClick={cancelEditing}
        >
          <Image
            src="/misc/CrossMark.svg"
            alt="Cancel edit"
            width={40}
            height={40}
            draggable={false}
            className="h-full aspect-square object-contain select-none"
          />
        </button>
      )}
    </div>
  );
};

export default ProfileName;
