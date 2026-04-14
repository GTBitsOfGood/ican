import ProfileInfo from "@/components/ui/ProfileInfo";
import { cn } from "@/lib/utils";
import { PetType } from "@/types/pet";

interface ProfileHeaderProps {
  petType: PetType;
  level: number;
  coins: number;
  currentExp: number;
  currentStreak: number;
  className?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  level,
  coins,
  currentExp,
  currentStreak,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex max-w-full items-start desktop:h-44 desktop:px-6 desktop:pt-6 largeDesktop:px-8 4xl:h-48 4xl:px-10",
        className,
      )}
    >
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
