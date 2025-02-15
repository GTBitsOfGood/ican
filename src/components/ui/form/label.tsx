interface LabelProps {
  children: string;
  className?: string;
  disabled?: boolean;
}

export default function Label({
  children,
  className,
  disabled = false,
}: LabelProps) {
  return (
    <div
      className={`text-4xl font-bold ${disabled ? "opacity-40" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
