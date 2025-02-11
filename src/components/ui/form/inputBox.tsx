import { ChangeEvent, KeyboardEvent, forwardRef } from "react";

interface InputBoxProps {
  value: string;
  className?: string;
  maxLength?: number;
  onChange: (value: string) => void;
  onFocusNext?: () => void;
  onFocusPrev?: () => void;
}

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>(
  (
    {
      value,
      className,
      maxLength = 1,
      onChange,
      onFocusNext,
      onFocusPrev,
    }: InputBoxProps,
    ref,
  ) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      if (newValue.length === 1 && onFocusNext) {
        onFocusNext();
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && value === "" && onFocusPrev) {
        onFocusPrev();
      }
    };

    return (
      <input
        ref={ref}
        type="text"
        value={value}
        maxLength={maxLength}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`noSelect border-2 border-black font-bold text-black uppercase outline-none text-center ${className}`}
      />
    );
  },
);

InputBox.displayName = "InputBox";

export default InputBox;
