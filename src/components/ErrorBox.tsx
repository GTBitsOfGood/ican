import { WarningCircle } from "@phosphor-icons/react";

interface ErrorBoxProps {
  message: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
  return (
    <>
      {message !== "" ? (
        <span className="flex self-start text-black mb-2 text-[19px]">
          <WarningCircle className="self-center mr-2" size={16} /> {message}
        </span>
      ) : (
        <> </>
      )}
    </>
  );
};

export default ErrorBox;
