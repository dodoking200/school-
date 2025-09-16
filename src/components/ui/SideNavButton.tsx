"use client";
import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import {
  HomeColorIcon,
  StudentsColorIcon,
  TeachersColorIcon,
  UsersColorIcon,
  ShieldColorIcon,
  CalendarColorIcon,
  BookColorIcon,
  BuildingColorIcon,
  AttendanceColorIcon,
  CurrencyDollarColorIcon,
} from "@/components/icons/ColorfulIcons";
import { cn } from "@/lib/utils";

interface SideNavButtonProps extends HTMLMotionProps<"button"> {
  icon: string;
  children: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

// Icon mapping for colorful modern icons
const iconMap = {
  home: { icon: HomeColorIcon, bgColor: "bg-blue-50 dark:bg-blue-900/20" },
  student: {
    icon: StudentsColorIcon,
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
  },
  teacher: {
    icon: TeachersColorIcon,
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  user: { icon: UsersColorIcon, bgColor: "bg-indigo-50 dark:bg-indigo-900/20" },
  shield: { icon: ShieldColorIcon, bgColor: "bg-red-50 dark:bg-red-900/20" },
  calendar: {
    icon: CalendarColorIcon,
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  auto_stories: {
    icon: BookColorIcon,
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
  class: { icon: BuildingColorIcon, bgColor: "bg-cyan-50 dark:bg-cyan-900/20" },
  attendance: {
    icon: AttendanceColorIcon,
    bgColor: "bg-pink-50 dark:bg-pink-900/20",
  },
  currency_dollar: {
    icon: CurrencyDollarColorIcon,
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  // Additional mappings for student/teacher pages
  Marks: { icon: BookColorIcon, bgColor: "bg-green-50 dark:bg-green-900/20" },
  Quizzes: {
    icon: BookColorIcon,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  Schedule: {
    icon: CalendarColorIcon,
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  grading: { icon: BookColorIcon, bgColor: "bg-green-50 dark:bg-green-900/20" },
  assignment: {
    icon: BookColorIcon,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
  event: {
    icon: CalendarColorIcon,
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
};

export function SideNavButton({
  icon,
  children,
  active = false,
  onClick,
  ...props
}: Omit<SideNavButtonProps, "className"> & { className?: string }) {
  const { className } = props as { className?: string };
  const iconConfig = iconMap[icon as keyof typeof iconMap] || iconMap.home;
  const IconComponent = iconConfig.icon;

  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn(
        "group relative flex items-center w-full text-left transition-all duration-300 ease-out",
        "px-3 py-2.5 rounded-xl font-medium text-sm",
        active
          ? "bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 shadow-lg border border-white/40 dark:border-gray-700/40"
          : "text-gray-600 dark:text-gray-300 hover:bg-white/30 dark:hover:bg-gray-800/30 hover:text-gray-900 dark:hover:text-gray-100",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Modern Colorful Icon */}
      <motion.div
        whileHover={{ rotate: 5, scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 flex-shrink-0",
          active
            ? iconConfig.bgColor
            : "bg-white/50 dark:bg-gray-800/50 group-hover:bg-white/70 dark:group-hover:bg-gray-700/70"
        )}
      >
        <IconComponent
          size={20}
          className="transition-transform duration-200"
        />
      </motion.div>

      {/* Label with proper spacing */}
      <span className="font-semibold tracking-wide ml-3 text-gray-800 dark:text-gray-200">
        {children}
      </span>

      {/* Active Indicator */}
      {active && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="ml-auto"
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
        </motion.div>
      )}

      {/* Modern Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: active
            ? "linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
        }}
      />
    </motion.button>
  );
}
