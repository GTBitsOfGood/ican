import Image from "next/image";
import { useState } from "react";

interface ProfileNameProps {
  name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name: initialName }) => {
  // Placeholder editing logic
  // Are we enforcing any max name size limit?
  const [isEditing, setEditing] = useState(true);
  const [name, setName] = useState(initialName);

  const toggleEditing = () => {
    setEditing((prev) => !prev)
  }

  return (
    <div className="flex flex-row">
        <input 
          className={`
            text-4xl font-bold bg-transparent border-none w-full 
            focus:outline-none focus:ring-0 focus:border-none
            ${!isEditing ? "pointer-events-none select-none" : ""}
          `}
          type="text"
          value={name}
          readOnly={!isEditing}
          onChange={(e) => setName(e.target.value)}
          maxLength={10}
          style={{ width: `${name.length + 1}ch` }}
        />
      <button className="relative w-7" onClick={toggleEditing}>
        <Image src="/icons/Edit.svg" alt="Edit" fill draggable={false} className="select-none"/>
      </button>
    </div>
  )
}

export default ProfileName;