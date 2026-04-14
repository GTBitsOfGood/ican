import type { ChangeEvent } from "react";

interface AuthInputProps {
  type?: string;
  name?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  hasError?: boolean;
}

export default function AuthInput({
  type = "text",
  name,
  placeholder,
  value,
  onChange,
  hasError = false,
}: AuthInputProps) {
  return (
    <input
      className={`h-12 w-full border-[3px] bg-white px-3 text-base font-quantico text-black outline-none transition-colors placeholder:text-[#7b7b7b] focus:border-icanBlue-300 ${
        hasError
          ? "border-errorRed text-errorRed placeholder:text-errorRed"
          : "border-[#8B8B8B]"
      }`}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}
