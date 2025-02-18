import { useRef } from "react";
import InputBox from "@/components/ui/form/inputBox";

interface IdInputProps {
  values: string[];
  setValues: (newValues: string[]) => void;
}

const IDInput = ({ values, setValues }: IdInputProps) => {
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
    <div className="mt-8 grid grid-cols-5">
      {values.map((value, index) => (
        <InputBox
          key={index}
          value={value}
          onChange={handleValueChange(index)}
          onFocusNext={() => handleFocusNext(index)}
          onFocusPrev={() => handleFocusPrev(index)}
          ref={inputRefs[index]}
          className={`
            w-20 h-20 text-6xl
            ${value.length == 0 ? "bg-icanBlue-100" : ""}
          `}
        />
      ))}
    </div>
  );
};

export default IDInput;
