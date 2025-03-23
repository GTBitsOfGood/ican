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
      className={`${checked ? "bg-icanGreen-300" : ""} flex-shrink-0 mx-1 w-8 h-8 tablet:w-12 tablet:h-12 border-4 tablet:border-8 border-icanBlue-200 outline outline-4 outline-white cursor-pointer ${className}`}
    ></div>
  );
}
