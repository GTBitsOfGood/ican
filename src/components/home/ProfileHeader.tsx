import ProfileInfo from "@/components/ui/ProfileInfo";
import { PetType } from "@/types/pet";

interface ProfileHeaderProps {
  petType: PetType;
  level: number;
  coins: number;
  currentExp: number;
  currentStreak: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  level,
  coins,
  currentExp,
  currentStreak,
}) => {
  return (
    <div className="flex h-44 w-fit items-start px-6 pt-6 largeDesktop:px-8 4xl:h-48 4xl:px-10">
      <ProfileInfo
        level={level}
        coins={coins}
        currentExp={currentExp}
        currentStreak={currentStreak}
      />
    </div>
  );
};

export default ProfileHeader;
