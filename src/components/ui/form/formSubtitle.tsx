interface FormSubtitleProps {
  children: string;
  className?: string;
  disabled?: boolean;
}

export default function FormSubtitle({
  children,
  className,
  disabled = false,
}: FormSubtitleProps) {
  return (
    <div
      className={`text-2xl font-bold ${disabled ? "opacity-40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
