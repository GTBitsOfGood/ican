import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface ProfileNameProps {
  name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name: initialName }) => {
  // Basic placeholder logic
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [inputWidth, setInputWidth] = useState(0);
  const spanRef = useRef<HTMLSpanElement>(null);

  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  useEffect(() => {
    if (spanRef.current) {
      setInputWidth(spanRef.current.offsetWidth);
    }
  }, [name]);

  return (
    <div className="relative flex flex-row flex-1 h-full items-center w-fit">
      {/* Reference span to correctly calculate width of input */}
      <span
        ref={spanRef}
        className="absolute invisible whitespace-pre text-2xl 4xl:text-4xl font-quantico font-bold"
      >
        {name || "X"}
      </span>

      <input
        className={`
          text-2xl 4xl:text-4xl font-quantico font-bold bg-transparent border-none w-fit 
          focus:outline-none focus:ring-0 focus:border-none
          ${!isEditing ? "pointer-events-none select-none" : ""}
        `}
        type="text"
        value={name}
        style={{ width: `${inputWidth}px` }}
        readOnly={!isEditing}
        onChange={(e) => setName(e.target.value)}
        maxLength={10}
      />

      <button
        className="relative h-3/5 aspect-square ml-1"
        onClick={toggleEditing}
      >
        <Image
          src="/icons/Edit.svg"
          alt="Edit"
          width={40}
          height={40}
          draggable={false}
          className="object-contain select-none"
        />
      </button>
    </div>
  );
};

export default ProfileName;
