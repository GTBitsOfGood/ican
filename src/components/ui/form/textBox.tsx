interface TextBoxProps {
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  placeHolder?: string;
}

export default function TextBox({
  value,
  onChange,
  className,
  placeHolder,
}: TextBoxProps) {
  return (
    <textarea
      className={`${className} max-h-[350px] min-h-64 placeholder:text-icanBlue-100 noSelect border-2 border-black text-black outline-none`}
      style={{
        resize: "vertical",
      }}
      placeholder={placeHolder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
