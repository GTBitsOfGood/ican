import Image from "next/image";
import { useState } from "react";

interface ProfileNameProps {
  name: string;
}

const ProfileName: React.FC<ProfileNameProps> = ({ name: initialName }) => {
  // Placeholder editing logic
  // Are we enforcing any max name size limit?
  const [isEditing, setEditing] = useState(false);
  const [name, setName] = useState(initialName);

  const toggleEditing = () => {
    setEditing((prev) => !prev)
  }

  return (
    <div className="flex flex-row flex-1 h-full items-center">
        {/* <input 
        // This logic is horrible, theres no way to have the input container fit only the text (can't calculate either)
          className={`
            text-2xl 4xl:text-4xl font-quantico font-bold bg-transparent border-none w-fit 
            focus:outline-none focus:ring-0 focus:border-none
            ${!isEditing ? "pointer-events-none select-none" : ""}
          `}
          type="text"
          value={name}
          readOnly={!isEditing}
          onChange={(e) => setName(e.target.value)}
          maxLength={10}
        /> */}
        
      <span className="text-3xl 4xl:text-4xl font-quantico font-bold bg-transparent border-none  inline-flex">{name}</span>

      <button className="relative h-3/5 aspect-square" onClick={toggleEditing}>
        <Image src="/icons/Edit.svg" alt="Edit" width={40} height={40} draggable={false} className="object-contain select-none"/>
      </button>
    </div>
  )
}

export default ProfileName;