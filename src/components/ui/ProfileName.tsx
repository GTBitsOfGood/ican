import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useUpdatePetName, usePet } from "../hooks/usePet";

const ProfileName: React.FC = () => {
  const { data: pet } = usePet();
  const updatePetNameMutation = useUpdatePetName();

  const [isEditing, setEditing] = useState(false);
  const [editingName, setEditingName] = useState("");
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

  return (
    <div className="relative inline-flex flex-row flex-1 h-full items-center">
      <input
        className={`
          text-2xl 4xl:text-4xl font-quantico font-bold bg-transparent text-white
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
      <button
        className={`relative h-3/5 w-fit ml-1 inline-block ${
          updatePetNameMutation.isPending ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={toggleEditing}
        disabled={updatePetNameMutation.isPending}
      >
        <Image
          src="/icons/Edit.svg"
          alt="Edit"
          width={40}
          height={40}
          draggable={false}
          className="h-full aspect-square object-contain select-none"
        />
      </button>
    </div>
  );
};

export default ProfileName;
