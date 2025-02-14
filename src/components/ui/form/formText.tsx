interface FormTextProps {
  children: string;
  className?: string;
  disabled?: boolean;
}

export default function FormText({
  children,
  className,
  disabled = false,
}: FormTextProps) {
  return (
    <div
      className={`text-3xl font-bold ${disabled ? "opacity-40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
