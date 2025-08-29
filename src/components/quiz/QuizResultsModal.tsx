import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, CheckCircleIcon, XCircleIcon, TrophyIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface QuizResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: {
    totalScore: number;
    totalQuestions: number;
    correctAnswers: number;
    passed: boolean;
    passingScore: number;
    totalMark: number;
  };
  quizTitle: string;
  studentName: string;
}

export default function QuizResultsModal({
  isOpen,
  onClose,
  results,
  quizTitle,
  studentName,
}: QuizResultsModalProps) {
  if (!isOpen) return null;

  const percentage = Math.round((results.totalScore / results.totalMark) * 100);
  const isExcellent = percentage >= 90;
  const isGood = percentage >= 80;
  const isAverage = percentage >= 70;
  const isPoor = percentage < 70;

  const getScoreColor = () => {
    if (isExcellent) return "text-emerald-600";
    if (isGood) return "text-blue-600";
    if (isAverage) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreIcon = () => {
    if (isExcellent) return "🏆";
    if (isGood) return "⭐";
    if (isAverage) return "📊";
    return "📝";
  };

  const getScoreMessage = () => {
    if (isExcellent) return "Excellent! Outstanding performance!";
    if (isGood) return "Great job! Well done!";
    if (isAverage) return "Good effort! Keep practicing!";
    return "Keep studying! You can do better!";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-full">
                    <TrophyIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Quiz Results</h2>
                    <p className="text-blue-100 text-sm">{quizTitle}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Student Info */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl text-white font-bold">
                    {studentName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{studentName}</h3>
                <p className="text-gray-600 text-sm">Quiz completed successfully!</p>
              </div>

              {/* Score Display */}
              <div className="text-center mb-8">
                <div className={cn("text-6xl font-bold mb-2", getScoreColor())}>
                  {getScoreIcon()} {percentage}%
                </div>
                <p className="text-gray-600 mb-4">{getScoreMessage()}</p>
                
                {/* Score Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={cn(
                      "h-3 rounded-full transition-all duration-500",
                      isExcellent && "bg-gradient-to-r from-emerald-400 to-emerald-600",
                      isGood && "bg-gradient-to-r from-blue-400 to-blue-600",
                      isAverage && "bg-gradient-to-r from-yellow-400 to-yellow-600",
                      isPoor && "bg-gradient-to-r from-red-400 to-red-600"
                    )}
                  />
                </div>

                {/* Score Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <ChartBarIcon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-600">Your Score</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {results.totalScore}
                    </div>
                    <div className="text-xs text-gray-500">out of {results.totalMark}</div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-600">Correct Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.correctAnswers}
                    </div>
                    <div className="text-xs text-gray-500">out of {results.totalQuestions}</div>
                  </div>
                </div>

                {/* Pass/Fail Status */}
                <div className={cn(
                  "inline-flex items-center space-x-2 px-6 py-3 rounded-full font-semibold",
                  results.passed 
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                )}>
                  {results.passed ? (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>PASSED!</span>
                    </>
                  ) : (
                    <>
                      <XCircleIcon className="w-5 h-5" />
                      <span>Failed - Try Again Next Time</span>
                    </>
                  )}
                </div>

                {!results.passed && (
                  <p className="text-sm text-gray-600 mt-2">
                    Passing score: {results.passingScore}/{results.totalMark}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  View Results
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center">
              <p className="text-sm text-gray-600">
                Results have been saved to your academic record
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
