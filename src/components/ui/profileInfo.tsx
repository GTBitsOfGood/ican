import Image from "next/image";
import ExpBar from "./ExpBar";

interface ProfileInfoProps {
  name: string;
  level: number;
  currentExp: number;
  totalExp: number;
  coins: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  name = "Name",
  level = 0,
  currentExp = 80,
  totalExp = 100,
  coins = 100,
}) => {
  return (
    <div className="flex flex-col w-64 h-full gap-2">
      <div className="flex flex-row gap-2">
        <span className="text-4xl font-bold">{name}</span>
        <button className="relative w-7">
          <Image src="/icons/Edit.svg" alt="Edit" fill />
        </button>
      </div>
      <ExpBar level={level} currentExp={currentExp} totalExp={totalExp} />
      <div className="flex flex-row items-center gap-4">
        <div className="relative w-12 h-auto aspect-square">
          <Image src="/icons/Coin-b.svg" alt="Coins" fill />
        </div>
        <span className="font-quantico text-3xl">{coins}</span>
      </div>
    </div>
  );
};

export default ProfileInfo;
