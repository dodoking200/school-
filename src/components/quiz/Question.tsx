"use client";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface QuestionProps {
  question: {
    id: number;
    question: string;
    options: Option[];
  };
  selectedAnswer: string | undefined;
  onAnswerSelect: (questionId: number, optionId: string) => void;
}

export default function Question({
  question,
  selectedAnswer,
  onAnswerSelect,
}: QuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-6"
    >
      {/* Question Text */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card !p-6 border-l-4 border-primary"
        style={{ borderLeftColor: "var(--primary)" }}
      >
        <h3
          className="text-xl font-bold leading-relaxed"
          style={{ color: "var(--foreground)" }}
        >
          {question.question}
        </h3>
      </motion.div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 rounded-xl ${
                isSelected
                  ? "ring-2 ring-primary transform scale-[1.02]"
                  : "hover:transform hover:scale-[1.01]"
              }`}
              onClick={() => onAnswerSelect(question.id, option.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`glass-card !p-4 flex items-center space-x-4 transition-all duration-300 ${
                  isSelected ? "shadow-xl" : "hover:shadow-lg"
                }`}
                style={{
                  background: isSelected
                    ? "var(--primary-light)"
                    : "var(--card-bg)",
                }}
              >
                {/* Custom Radio Button */}
                <div className="relative flex-shrink-0">
                  <input
                    type="radio"
                    id={`q${question.id}-o${option.id}`}
                    name={`q${question.id}`}
                    value={option.id}
                    checked={isSelected}
                    onChange={() => onAnswerSelect(question.id, option.id)}
                    className="sr-only"
                  />
                  <motion.div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "border-primary bg-primary shadow-lg"
                        : "border-gray-300 hover:border-primary"
                    }`}
                    style={{
                      borderColor: isSelected
                        ? "var(--primary)"
                        : "var(--foreground-muted)",
                      backgroundColor: isSelected
                        ? "var(--primary)"
                        : "transparent",
                    }}
                    initial={false}
                    animate={{
                      scale: isSelected ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                {/* Option Text */}
                <label
                  htmlFor={`q${question.id}-o${option.id}`}
                  className={`flex-1 text-base font-medium cursor-pointer transition-colors duration-300 ${
                    isSelected ? "text-primary" : ""
                  }`}
                  style={{
                    color: isSelected ? "var(--primary)" : "var(--foreground)",
                  }}
                >
                  {option.text}
                </label>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: "var(--primary)" }}
                    ></div>
                  </motion.div>
                )}
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
