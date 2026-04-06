import Image from "next/image";
import ExpBar from "./ExpBar";
import ProfileName from "./ProfileName";

interface ProfileInfoProps {
  // name: string;
  level: number;
  coins: number;
  currentExp: number;
  currentStreak: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  // name,
  level,
  coins,
  currentExp,
  currentStreak,
}) => {
  return (
    <div className="flex w-fit flex-col gap-3.5">
      <ProfileName />
      <ExpBar level={level} currentExp={currentExp} />

      <div className="flex h-10 w-fit flex-row items-center gap-2.5 4xl:h-11">
        <div className="relative h-10 w-10 4xl:h-11 4xl:w-11">
          <Image
            src="/icons/Coin.svg"
            alt="Coins"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
        <span className="font-quantico text-[1.85rem] font-bold text-stroke-4 text-white text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke letter-spacing-ui 4xl:text-[2.05rem]">
          {coins}
        </span>
      </div>

      <div className="flex h-10 w-fit flex-row items-center gap-2.5 4xl:h-11">
        <div className="relative h-10 w-10 4xl:h-11 4xl:w-11">
          <Image
            src="/icons/streak-fire.png"
            alt="Current streak"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
        <span className="font-quantico text-[1.85rem] font-bold text-stroke-4 text-white text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke letter-spacing-ui 4xl:text-[2.05rem]">
          {currentStreak} Days
        </span>
      </div>
    </div>
  );
};

export default ProfileInfo;
