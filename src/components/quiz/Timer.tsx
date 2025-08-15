"use client";
import { useState, useEffect } from "react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

export default function Timer({ initialTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onTimeUp]);

  return (
    <div className="text-lg font-mono">
      Time Left: {Math.floor(timeLeft / 60)}:{("0" + (timeLeft % 60)).slice(-2)}
    </div>
  );
}
