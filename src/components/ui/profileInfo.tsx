import Image from "next/image";
import ExpBar from "./ExpBar";
import ProfileName from "./ProfileName";

interface ProfileInfoProps {
  name: string;
  level: number;
  coins: number;
  currentExp: number;
  totalExp?: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name,
  level,
  coins,
  currentExp,
  totalExp = 100,
}) => {
  return (
    <div className="flex flex-col w-64 h-full gap-2">
      <ProfileName name = {name} />
      <ExpBar level={level} currentExp={currentExp} totalExp={totalExp} />

      <div className="flex flex-row items-center gap-4">
        <div className="relative w-12 h-auto aspect-square">
          <Image src="/icons/Coin-b.svg" alt="Coins" fill draggable={false} className="select-none"/>
        </div>
        <span className="font-quantico text-3xl">{coins}</span>
      </div>
    </div>
  );
};

export default ProfileInfo;
