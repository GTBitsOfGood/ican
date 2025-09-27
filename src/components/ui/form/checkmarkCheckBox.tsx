interface CheckmarkCheckBoxProps {
  checked: boolean;
  onChange: () => void;
  className?: string;
}

export default function CheckmarkCheckBox({
  checked,
  onChange,
  className = "",
}: CheckmarkCheckBoxProps) {
  return (
    <div
      onClick={onChange}
      className={`
        w-12 h-12 tablet:w-16 tablet:h-16
        border-4 border-white
        bg-transparent
        flex items-center justify-center
        cursor-pointer
        ${className}
      `}
    >
      {checked && (
        <svg
          width="50"
          height="42"
          viewBox="0 0 50 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.72519 19.5L0 24.75L16.4122 42L50 7.875L41.9847 0L16.4122 33.75L5.72519 19.5Z"
            fill="#98D03B"
          />
        </svg>
      )}
    </div>
  );
}
