import Image from "next/image";
import ExpBar from "./ExpBar";
import ProfileName from "./ProfileName";

interface ProfileInfoProps {
  level: number;
  coins: number;
  currentExp: number;
  currentStreak: number;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  level,
  coins,
  currentExp,
  currentStreak,
}) => {
  const statRowClassName =
    "flex h-[29px] w-fit items-center gap-3 desktop:h-10 desktop:gap-2.5 4xl:h-11 4xl:gap-4";
  const statIconClassName =
    "relative h-[29px] aspect-square desktop:h-10 4xl:h-11";
  const statValueClassName =
    "font-quantico font-bold text-[2rem] text-stroke-4 text-white text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke letter-spacing-ui";

  return (
    <div className="flex max-w-full flex-col gap-2 desktop:w-fit desktop:gap-3.5">
      <ProfileName />
      <ExpBar level={level} currentExp={currentExp} />

      <div className={statRowClassName}>
        <div className={statIconClassName}>
          <Image
            src="/icons/Coin.svg"
            alt="Coins"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
        <span className={statValueClassName}>{coins}</span>
      </div>

      <div className={statRowClassName}>
        <div className={statIconClassName}>
          <Image
            src="/icons/streak-fire.png"
            alt="Current streak"
            fill
            draggable={false}
            className="select-none object-contain"
          />
        </div>
        <span className={statValueClassName}>{currentStreak} Days</span>
      </div>
    </div>
  );
};

export default ProfileInfo;
