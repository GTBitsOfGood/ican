import Image from "next/image";
import ExpBar from "./ExpBar";
import ProfileName from "./ProfileName";

interface ProfileInfoProps {
  // name: string;
  level: number;
  coins: number;
  currentExp: number;
  totalExp?: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  // name,
  level,
  coins,
  currentExp,
  totalExp = 100,
}) => {
  return (
    <div className="flex flex-col h-full w-fit gap-2">
      <ProfileName />
      <ExpBar level={level} currentExp={currentExp} totalExp={totalExp} />

      <div className="flex flex-1 flex-row w-fit items-center gap-3 4xl:gap-4">
        <div className="relative h-full aspect-square">
          <Image
            src="/icons/Coin-b.svg"
            alt="Coins"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
        <span className="font-quantico font-bold text-[2rem] text-stroke-4 text-white text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke letter-spacing-ui">
          {coins}
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
