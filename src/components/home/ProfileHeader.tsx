import ProfileInfo from "@/components/ui/ProfileInfo";
import { PetType } from "@/types/pet";

interface ProfileHeaderProps {
  petType: PetType;
  level: number;
  coins: number;
  currentExp: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  level,
  coins,
  currentExp,
}) => {
  return (
    <div className="flex h-52 w-fit p-8 items-center gap-10 mobile:px-2 tablet:px-4 desktop:px-8 largeDesktop:px-10 4xl:h-56 4xl:gap-12 4xl:px-16">
      <ProfileInfo level={level} coins={coins} currentExp={currentExp} />
    </div>
  );
};

export default ProfileHeader;
