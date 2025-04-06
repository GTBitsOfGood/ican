import PetHTTPClient from "@/http/petHTTPClient";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../UserContext";

interface ProfileNameProps {
  name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name: initialName }) => {
  const { userId } = useUser();
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleEditing = async () => {
    if (name.trim() === "") {
      setName(initialName);
      // Temporary alert popup until a better component can be made
      alert("Name cannot be empty");
      return;
    }

    if (name.trim() !== "" && isEditing && name != initialName) {
      try {
        await PetHTTPClient.updatePet(name, userId as string);
        initialName = name;
        console.log("Pet data updated successfully");
      } catch (error) {
        console.error("Error updating pet data:", error);
      }
    }
    setEditing((prev) => !prev);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(name.length, name.length);
    }
  }, [isEditing, name]);

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
        value={name}
        readOnly={!isEditing}
        onChange={(e) => setName(e.target.value)}
        maxLength={20}
        style={{ width: `${Math.max(name.length, 3)}ch` }}
      />
      <button
        className="relative h-3/5 w-fit ml-1 inline-block"
        onClick={toggleEditing}
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
