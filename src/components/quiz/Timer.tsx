"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, AlertTriangle } from "lucide-react";

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
}

export default function Timer({ initialTime, onTimeUp }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isWarning, setIsWarning] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

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

  useEffect(() => {
    const percentage = (timeLeft / initialTime) * 100;
    setIsWarning(percentage <= 25 && percentage > 10);
    setIsCritical(percentage <= 10);
  }, [timeLeft, initialTime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / initialTime) * 100;

  const getTimerColor = () => {
    if (isCritical) return "var(--danger)";
    if (isWarning) return "var(--warning)";
    return "var(--primary)";
  };

  const getTimerBg = () => {
    if (isCritical) return "var(--danger-light)";
    if (isWarning) return "var(--warning-light)";
    return "var(--primary-light)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <div 
        className={`glass-card !p-4 flex items-center space-x-3 transition-all duration-300 ${
          isCritical ? 'animate-pulse' : ''
        }`}
        style={{
          backgroundColor: getTimerBg(),
          borderColor: getTimerColor(),
        }}
      >
        {/* Timer Icon */}
        <motion.div
          animate={{
            rotate: isCritical ? [0, -5, 5, -5, 5, 0] : 0,
          }}
          transition={{
            duration: 0.5,
            repeat: isCritical ? Infinity : 0,
            repeatDelay: 1
          }}
        >
          {isCritical ? (
            <AlertTriangle 
              className="w-6 h-6" 
              style={{ color: getTimerColor() }}
            />
          ) : (
            <Clock 
              className="w-6 h-6" 
              style={{ color: getTimerColor() }}
            />
          )}
        </motion.div>

        {/* Time Display */}
        <div className="flex flex-col items-start">
          <div className="text-xs font-medium opacity-75" style={{ color: getTimerColor() }}>
            Time Remaining
          </div>
          <motion.div 
            className="text-xl font-bold font-mono tracking-wider"
            style={{ color: getTimerColor() }}
            animate={{
              scale: isCritical && timeLeft % 2 === 1 ? 1.1 : 1,
            }}
            transition={{ duration: 0.1 }}
          >
            {String(minutes).padStart(2, '0')}:
            <span className={isCritical ? 'animate-pulse' : ''}>
              {String(seconds).padStart(2, '0')}
            </span>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-24">
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full transition-all duration-1000 ease-out"
              style={{
                backgroundColor: getTimerColor(),
                width: `${percentage}%`,
              }}
              initial={{ width: "100%" }}
              animate={{ width: `${percentage}%` }}
            />
          </div>
          <div 
            className="text-xs font-medium mt-1 text-center"
            style={{ color: getTimerColor() }}
          >
            {Math.round(percentage)}%
          </div>
        </div>
      </div>

      {/* Warning Messages */}
      <AnimatePresence>
        {isWarning && !isCritical && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 text-center text-xs font-medium"
            style={{ color: "var(--warning)" }}
          >
            ⚠️ Less than 25% time remaining
          </motion.div>
        )}
        {isCritical && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-8 left-0 right-0 text-center text-xs font-medium animate-pulse"
            style={{ color: "var(--danger)" }}
          >
            🚨 Critical: Less than 10% time remaining!
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
