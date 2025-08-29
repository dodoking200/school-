import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine classes with tailwind-merge to resolve conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Create consistent button variant styles
 */
export const buttonVariants = {
  primary: "bg-gradient-primary hover:shadow-modern-lg transform hover:-translate-y-0.5 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300",
  secondary: "bg-gradient-secondary hover:shadow-modern-lg transform hover:-translate-y-0.5 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300",
  success: "bg-gradient-success hover:shadow-modern-lg transform hover:-translate-y-0.5 text-white font-semibold px-6 py-2.5 rounded-lg transition-all duration-300",
  outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 font-semibold px-6 py-2.5 rounded-lg transition-all duration-300",
  ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-semibold px-6 py-2.5 rounded-lg transition-all duration-300",
};

/**
 * Create consistent card variant styles
 */
export const cardVariants = {
  default: "bg-white border border-gray-200 rounded-2xl shadow-modern hover:shadow-modern-lg transition-all duration-300 p-6",
  glass: "glass-card",
  gradient: "bg-gradient-primary text-white rounded-2xl shadow-modern-lg hover:shadow-modern-xl transition-all duration-300 p-6",
};

/**
 * Create consistent input variant styles
 */
export const inputVariants = {
  default: "modern-input w-full",
  search: "modern-input w-full pl-12 pr-4",
  select: "modern-input w-full cursor-pointer",
};

/**
 * Generate random gradient for dynamic elements
 */
export const gradients = [
  "bg-gradient-primary",
  "bg-gradient-secondary", 
  "bg-gradient-success",
  "bg-gradient-warm",
  "bg-gradient-cool",
];

export function getRandomGradient() {
  return gradients[Math.floor(Math.random() * gradients.length)];
}

/**
 * Animation delays for staggered animations
 */
export function getStaggerDelay(index: number) {
  return { animationDelay: `${index * 100}ms` };
}

/**
 * Format a datetime string to a readable date format
 * @param datetime - ISO datetime string
 * @returns Formatted date string (e.g., "Oct 29, 2025")
 */
export function formatDate(datetime: string): string {
  try {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return datetime;
  }
}

/**
 * Format a datetime string to a readable time format
 * @param datetime - ISO datetime string
 * @returns Formatted time string (e.g., "12:30 PM")
 */
export function formatTime(datetime: string): string {
  try {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return datetime;
  }
}

/**
 * Get the time remaining until a datetime
 * @param datetime - ISO datetime string
 * @returns Time remaining string (e.g., "2 days", "3 hours", "Expired")
 */
export function getTimeRemaining(datetime: string): string {
  try {
    const now = new Date();
    const targetDate = new Date(datetime);
    const diffTime = targetDate.getTime() - now.getTime();
    
    if (diffTime <= 0) {
      return 'Expired';
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
    } else {
      return 'Less than a minute';
    }
  } catch (error) {
    console.error('Error calculating time remaining:', error);
    return 'Unknown';
  }
}
