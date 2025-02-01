import React, { useEffect } from "react";

type TimerProps = {
  time: number;
  setTime: (time: number) => void;
};

export default function Timer({ time, setTime }: TimerProps) {
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (time > 0) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className="text-iCAN-gray text-[32px]">
      0:{time >= 10 ? time : `0${time}`}
    </div>
  );
}
