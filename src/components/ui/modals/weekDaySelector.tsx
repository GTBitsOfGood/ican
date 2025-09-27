import { DayOfWeek, DAYS_OF_WEEK, DAYS_OF_WEEK_ACR } from "@/lib/consts";

interface WeekDaySelectorProps {
  selectedDays: DayOfWeek[];
  onSelect: (newDay: number) => void;
  disabled?: boolean;
}

export default function WeekDaySelector({
  selectedDays,
  onSelect,
  disabled = false,
}: WeekDaySelectorProps) {
  return (
    <div className="flex gap-2 font-belanosima">
      {DAYS_OF_WEEK_ACR.map((day_acr, index) => {
        const day = DAYS_OF_WEEK[index];
        return (
          <div
            key={index}
            className={`
                          noSelect w-14 h-14 flex justify-center items-center text-black text-2xl rounded-full cursor-pointer
                          ${selectedDays.includes(day) ? "bg-icanGreen-300" : "bg-gray-200"}
                          ${disabled ? "opacity-40" : ""}
                      `}
            onClick={() => onSelect(index)}
          >
            {day_acr}
          </div>
        );
      })}
    </div>
  );
}
