import Image from "next/image";
import { useState, useEffect, useRef } from "react";
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

  const cancelEditing = () => {
    setEditingName(currentName);
    setEditing(false);
  };

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
  }, [isEditing, currentName]);

  return (
    <div
      ref={profileRef}
      className="relative inline-flex flex-row flex-1 h-full items-center"
    >
      <input
        className={`
          text-4xl 4xl:text-4xl font-quantico font-bold bg-transparent text-white
          w-auto min-w-[4rem] max-w-full
          ${
            !isEditing
              ? "focus:outline-none focus:ring-0 focus:border-none pointer-events-none select-none border-none"
              : "animate-pulse outline-dashed outline-white outline-2"
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

      {/* Start Edit Name/ Confirm Edit Name */}
      <button
        className={`relative h-3/5 w-fit ml-1 inline-block ${
          updatePetNameMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={toggleEditing}
        disabled={updatePetNameMutation.isPending}
      >
        <Image
          src={isEditing ? "/misc/CheckMark.svg" : "/icons/Edit.svg"}
          alt="Edit"
          width={40}
          height={40}
          draggable={false}
          className="h-full aspect-square object-contain select-none"
        />
      </button>

      {/* Exit Edit Name */}
      {isEditing && (
        <button
          className="relative h-3/5 w-fit inline-block"
          onClick={cancelEditing}
        >
          <Image
            src="/misc/CrossMark.svg"
            alt="Edit"
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
