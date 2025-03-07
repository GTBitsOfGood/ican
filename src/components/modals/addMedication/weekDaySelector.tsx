interface WeekDaySelectorProps {
  selectedDays: number[];
  onSelect: (newDay: number) => void;
  disabled?: boolean;
}

export default function WeekDaySelector({
  selectedDays,
  onSelect,
  disabled = false,
}: WeekDaySelectorProps) {
  const DAYS = ["SN", "M", "TU", "W", "TH", "F", "ST"];

  return (
    <div className="flex justify-center items-center mt-6 gap-2 font-belanosima">
      {DAYS.map((day, index) => (
        <div
          key={index}
          className={`
                        noSelect w-14 h-14 flex justify-center items-center text-black text-2xl rounded-full cursor-pointer 
                        ${selectedDays.includes(index) ? "bg-icanGreen-300" : "bg-gray-200"}
                        ${disabled ? "opacity-40" : ""}
                    `}
          onClick={() => onSelect(index)}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
