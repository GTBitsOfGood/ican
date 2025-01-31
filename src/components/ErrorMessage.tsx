import Image from "next/image";

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <div className="text-black gap-y-2 flex items-center">
      <span>
        <Image
          src="assets/ErrorIcon.svg"
          alt="Error Icon"
          height={15}
          width={15}
        />
      </span>
      <p>{message}</p>
    </div>
  );
}
