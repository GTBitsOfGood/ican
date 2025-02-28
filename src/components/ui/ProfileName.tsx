import { petService } from "@/http/petService";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useUser } from "../UserContext";

interface ProfileNameProps {
  name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name: initialName }) => {
  const { userId } = useUser();
  // Basic placeholder logic
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [inputWidth, setInputWidth] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleEditing = async () => {
    if (isEditing && name != initialName) {
      try {
        await petService.updatePet(name, userId as string);
        initialName = name;
        console.log("Pet data updated successfully");
      } catch (error) {
        console.error("Error updating pet data:", error);
      }
    }

    setEditing((prev) => !prev);
  };

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth);
    }
  }, [name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="relative inline-flex flex-row flex-1 h-full items-center">
      {/* Reference span to correctly calculate width of input */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre text-2xl 4xl:text-4xl font-bold"
      >
        {"_" + name}
      </span>
      <input
        className={`
          text-2xl 4xl:text-4xl font-quantico font-bold bg-transparent text-white
          ${!isEditing ? "focus:outline-none focus:ring-0 focus:border-none pointer-events-none select-none border-none" : "animate-pulse outline-dashed outline-white outline-2"}
        `}
        type="text"
        ref={inputRef}
        value={name}
        style={{ width: `${inputWidth}px` }}
        readOnly={!isEditing}
        onChange={(e) => setName(e.target.value)}
        maxLength={9}
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
