import Image from "next/image";
import ProfileFrame from "../svg/ProfileFrame";

type CharacterType = "cat" | "dino" | "dog" | "duck" | "penguin";

interface ProfilePictureProps {
  character: CharacterType;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ character }) => {
  const imagePath = `/characters/${character}.png`;

  return (
    // 120px x 128px profile border, these are temporary sizes until I figure out how I should scale these with screen sizes. I also rounded numbers from figma, unless I shouldn't. w-[120px] h-[128px]
    <div className="relative w-[9rem] h-[9.625rem]">
      {/* Background */}
      <div className="absolute inset-2 rounded-[44.268px] bg-[#D2D8BF]" />

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

      <ProfileFrame/>

    </div>
  );
};

export default ProfilePicture;
