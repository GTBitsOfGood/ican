import { WarningCircle } from "@phosphor-icons/react";

interface ErrorBoxProps {
  message: string;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ message }) => {
  return (
    <>
      {message !== "" ? (
        <span className="flex self-start text-errorRed mb-2 mobile:text-[12px] short:text-[12px] tablet:text-[16px]">
          <WarningCircle
            className="self-center mr-1"
            size={16}
            color="#EF4444"
          />{" "}
          {message}
        </span>
      ) : (
        <> </>
      )}
    </>
  );
};

export default ErrorBox;
