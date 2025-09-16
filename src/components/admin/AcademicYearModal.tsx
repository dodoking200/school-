import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AcademicYear, AcademicYearCreatePayload } from "@/types";

interface AcademicYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    academicYearData: AcademicYearCreatePayload & { id?: number }
  ) => void;
  academicYear: AcademicYear | null;
  title: string;
}

export default function AcademicYearModal({
  isOpen,
  onClose,
  onSubmit,
  academicYear,
  title,
}: AcademicYearModalProps) {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [fullTuition, setFullTuition] = useState<number>(0);

  useEffect(() => {
    if (academicYear) {
      setStartYear(academicYear.start_year);
      setEndYear(academicYear.end_year);
      setFullTuition(academicYear.full_tuition);
    } else {
      setStartYear("");
      setEndYear("");
      setFullTuition(0);
    }
  }, [academicYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: academicYear?.id,
      start_year: startYear,
      end_year: endYear,
      full_tuition: fullTuition,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(20px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/20"
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl p-8">
            <motion.div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-gradient-primary rounded-full" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Configure academic year settings
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 flex items-center justify-center transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </motion.div>
            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    📅 Start Date
                  </label>
                  <input
                    type="date"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="modern-input"
                    required
                  />
                </motion.div>
                <motion.div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    📅 End Date
                  </label>
                  <input
                    type="date"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="modern-input"
                    required
                  />
                </motion.div>
              </div>
              <motion.div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  💰 Full Tuition Fee
                </label>
                <input
                  type="number"
                  value={fullTuition}
                  onChange={(e) => setFullTuition(Number(e.target.value))}
                  className="modern-input"
                  placeholder="Enter tuition amount"
                  min="0"
                  step="0.01"
                  required
                />
              </motion.div>
              <motion.div className="flex justify-end gap-4 pt-6 border-t border-white/10 dark:border-gray-700/20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-200 backdrop-blur-sm"
                >
                  ❌ Cancel
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✨ Save Academic Year
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
