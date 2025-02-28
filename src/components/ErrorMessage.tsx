import Image from "next/image";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="text-black gap-x-2 flex items-center text-2xl">
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
