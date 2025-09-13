import Label from "./label";

interface LabelProps {
  children: string;
  type: string;
  className?: string;
  disabled?: boolean;
}

export default function FormLabel({
  children,
  className,
  disabled = false,
  type,
}: LabelProps) {
  let ending = null;
  if (type == "required") {
    ending = (
      <Label className="text-iCAN-error" disabled={disabled}>
        *
      </Label>
    );
  } else if (type == "optional") {
    ending = (
      <Label className="text-icanBlue-100 ml-1" disabled={disabled}>
        [Optional]
      </Label>
    );
  }
  return (
    <span className="flex flex-row items-center gap-0">
      <Label className={className} disabled={disabled}>
        {children}
      </Label>
      {ending}
    </span>
  );
}
