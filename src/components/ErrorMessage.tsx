import Image from "next/image";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="flex self-start text-black mb-2 mobile:text-[12px] short:text-[12px] tablet:text-[16px]">
      <span>
        <Image
          src="assets/ErrorIcon.svg"
          alt="Error Icon"
          height={24}
          width={24}
        />
      </span>
      <p>{message}</p>
    </div>
  );
}
