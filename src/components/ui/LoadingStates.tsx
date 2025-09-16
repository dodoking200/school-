import React from "react";
import { motion } from "framer-motion";

// Modern Loading Spinner
type SpinnerSize = "sm" | "md" | "lg" | "xl";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

export const LoadingSpinner = ({ size = "md", className = "" }: LoadingSpinnerProps) => {
  const sizeMap: Record<SpinnerSize, string> = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`${sizeMap[size]} border-3 border-primary-200 border-t-primary-600 rounded-full`}
      />
    </div>
  );
};

// Pulsing Dots Loader
export const DotsLoader = ({ className = "" }) => {
  return (
    <div className={`flex space-x-2 justify-center items-center ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{
            y: ["0%", "-50%", "0%"],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut"
          }}
          className="w-3 h-3 bg-gradient-primary rounded-full"
        />
      ))}
    </div>
  );
};

// Skeleton Loader for Table Rows
export const TableRowSkeleton = ({ columns = 7 }) => {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: columns }).map((_, index) => (
        <td key={index} className="px-6 py-5">
          <div className="h-4 bg-gray-200 rounded-lg" style={{
            width: `${60 + Math.random() * 40}%`
          }} />
        </td>
      ))}
    </tr>
  );
};

// Card Skeleton Loader
export const CardSkeleton = ({ className = "" }) => {
  return (
    <div className={`glass-card animate-pulse ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
        <div className="w-16 h-6 bg-gray-200 rounded-lg" />
      </div>
      <div className="space-y-2">
        <div className="w-24 h-4 bg-gray-200 rounded" />
        <div className="w-32 h-8 bg-gray-200 rounded" />
      </div>
      <div className="mt-4 h-1 bg-gray-200 rounded-full" />
    </div>
  );
};

// Modern Empty State Component
interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  action,
  className = "" 
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      {/* Animated Icon Container */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-lg"
      >
        {Icon && <Icon className="w-12 h-12 text-gray-400" />}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-2xl font-bold text-gray-600 mb-3">{title}</h3>
        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">{description}</p>
      </motion.div>

      {/* Action Button */}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

// Page Loading Component
export const PageLoader = ({ message = "Loading amazing content..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-8 border-4 border-primary-200 border-t-primary-600 rounded-full"
        />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">{message}</h2>
        <DotsLoader />
      </motion.div>
    </div>
  );
};

// Shimmer Effect for Images/Content
export const ShimmerBox = ({ width = "100%", height = "200px", className = "" }) => {
  return (
    <div 
      className={`bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-size-200 animate-shimmer rounded-xl ${className}`}
      style={{ width, height }}
    />
  );
};
