import Image from "next/image";
import ProfileFrame from "./svg/ProfileFrame";

// Should I worry about the vector for the profile in this iteration?
// Should I have it so I can pass in a size to define the outer <div>?

// The type and const are placeholders for testing purposes
type CharacterType = "duck" | "dino" | "dog" | "cat" | "penguin";

const characterMap: Record<CharacterType, string> = {
  duck: "/characters/duck.png",
  dino: "/characters/dino.png",
  dog: "/characters/dog.png",
  cat: "/characters/cat.png",
  penguin: "/characters/penguin.png",
};

interface ProfileProps {
  character?: CharacterType;
}

const Profile: React.FC<ProfileProps> = ({ character = "duck" }) => {
  const imagePath = characterMap[character];

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
          className="object-contain"
        />
      </div>
      
      <ProfileFrame/>

    </div>
  );
};

export default Profile;
