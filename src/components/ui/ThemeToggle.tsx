"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="relative w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      {/* Track */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          background: isDark 
            ? "linear-gradient(45deg, #1e293b, #334155)" 
            : "linear-gradient(45deg, #e2e8f0, #cbd5e1)"
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Thumb */}
      <motion.div
        className="relative w-6 h-6 rounded-full shadow-lg flex items-center justify-center z-10"
        animate={{
          x: isDark ? 32 : 0,
          background: isDark 
            ? "linear-gradient(45deg, #4338ca, #6366f1)"
            : "linear-gradient(45deg, #f59e0b, #f97316)"
        }}
        transition={{ 
          type: "spring", 
          stiffness: 500, 
          damping: 30,
          duration: 0.3
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: isDark ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            // Moon Icon
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                fill="white"
              />
            </svg>
          ) : (
            // Sun Icon  
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" fill="white"/>
              <path
                d="m12 1 0 2m0 18 0 2M4.22 4.22l1.42 1.42m12.72 12.72 1.42 1.42M1 12l2 0m18 0 2 0M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </motion.div>
      </motion.div>
      
      {/* Background Decoration */}
      <motion.div
        className="absolute inset-1 rounded-full opacity-20"
        animate={{
          background: isDark
            ? "radial-gradient(circle, #8b5cf6, transparent)"
            : "radial-gradient(circle, #f59e0b, transparent)"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
}
