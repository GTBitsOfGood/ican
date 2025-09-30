interface OnboardingHeaderProps {
  subtitle?: string;
  title: string;
  description?: string;
  titleColor?: "white" | "red";
  className?: string;
}

export default function OnboardingHeader({
  subtitle,
  title,
  description,
  titleColor = "white",
  className = "",
}: OnboardingHeaderProps) {
  const titleColorClass = titleColor === "red" ? "text-red-200" : "text-white";

  return (
    <div className={`w-full flex flex-col gap-2.5 ${className}`}>
      <div>
        {subtitle && (
          <p className="text-white/60 text-2xl desktop:text-6xl font-bold font-quantico">
            {subtitle}
          </p>
        )}
        <p
          className={`${titleColorClass} text-3xl desktop:text-6xl font-bold font-quantico`}
        >
          {title}
        </p>
      </div>
      {description && (
        <p className="text-stone-50 text-lg desktop:text-2xl font-normal font-quantico">
          {description}
        </p>
      )}
    </div>
  );
}
