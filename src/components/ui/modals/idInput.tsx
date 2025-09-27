import { useRef } from "react";
import InputBox from "@/components/ui/form/inputBox";

interface IdInputProps {
  values: string[];
  setValues: (newValues: string[]) => void;
  error: boolean;
}

const IDInput = ({ values, setValues, error }: IdInputProps) => {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleValueChange = (index: number) => (newValue: string) => {
    const newValues = [...values];
    newValues[index] = newValue;
    setValues(newValues);
  };

  const handleFocusNext = (index: number) => {
    if (index < values.length - 1 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleFocusPrev = (index: number) => {
    if (index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  return (
    <div className="mt-8 flex gap-4 smallTablet:gap-6 tablet:grid tablet:grid-cols-5">
      {values.map((value, index) => (
        <InputBox
          key={index}
          value={value}
          onChange={handleValueChange(index)}
          onFocusNext={() => handleFocusNext(index)}
          onFocusPrev={() => handleFocusPrev(index)}
          ref={inputRefs[index]}
          className={`
             w-12 h-12 smallTablet:w-14 smallTablet:h-14 text-4xl tablet:w-20 tablet:h-20 tablet:text-6xl
            ${value.length == 0 ? "bg-icanBlue-100" : ""} ${error ? "border-iCAN-error" : ""}
          `}
        />
      ))}
    </div>
  );
};

export default IDInput;
