interface CheckBoxProps {
  checked: boolean;
  className?: string;
  onChange: () => void;
}

export default function CheckBox({
  checked,
  className,
  onChange,
}: CheckBoxProps) {
  return (
    <div
      onClick={() => onChange()}
      className={`${checked ? "bg-icanGreen-300" : ""} mx-1 w-12 h-12 border-8 border-icanBlue-200 outline outline-4 outline-white cursor-pointer ${className}`}
    ></div>
  );
}
