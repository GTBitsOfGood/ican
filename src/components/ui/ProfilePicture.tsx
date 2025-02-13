import Image from "next/image";
import ProfileFrame from "../svg/ProfileFrame";
import { CharacterType } from "@/types/characters";

interface ProfilePictureProps {
  character: CharacterType;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ character }) => {
  const imagePath = `/characters/${character}.svg`;

  return (
    <div className="relative aspect-profile-picture w-[8rem] 4xl:w-[9.0625rem]">
      {/* Background */}
      <div className="absolute inset-2 rounded-[40px] bg-[#D2D8BF]" />

      {/* Character - Although it looks blurry up close if optimized */}
      <div className="absolute w-1/2 h-2/3 inset-0 m-auto">
        <Image
          src={imagePath}
          alt={`${character}`}
          fill
          draggable="false"
          className="object-contain pointer-events-none select-none"
        />
      </div>

      <ProfileFrame />
    </div>
  );
};

export default ProfilePicture;
