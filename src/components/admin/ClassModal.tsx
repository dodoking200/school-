import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Class } from "@/types";

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: Omit<Class, "id"> & { id?: number }) => void;
  classData?: Class | null;
  title: string;
}

export default function ClassModal({
  isOpen,
  onClose,
  onSubmit,
  classData,
  title,
}: ClassModalProps) {
  const [formData, setFormData] = useState<{
    class_name: string;
    floor_number: number | "";
    level_grade: number | "";
  }>({
    class_name: "",
    floor_number: 0,
    level_grade: 9,
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        class_name: classData.class_name,
        floor_number: classData.floor_number,
        level_grade: classData.level_grade,
      });
    } else {
      setFormData({
        class_name: "",
        floor_number: 0,
        level_grade: 9,
      });
    }
  }, [classData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "floor_number" || name === "level_grade") {
      const numValue = parseInt(value, 10);
      setFormData({ ...formData, [name]: isNaN(numValue) ? "" : numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      floor_number: Number(formData.floor_number),
      level_grade: Number(formData.level_grade),
    };
    onSubmit({
      ...(classData ? { id: classData.id } : {}),
      ...payload,
    });
    onClose();
  };

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
        {/* Animated Background Blur */}
        <motion.div
          initial={{ backdropFilter: "blur(0px)" }}
          animate={{ backdropFilter: "blur(20px)" }}
          exit={{ backdropFilter: "blur(0px)" }}
          className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/30 to-indigo-900/20"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-xl"
        >
          <div
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl p-8"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
            }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-between items-center mb-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-gradient-primary rounded-full" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Configure classroom settings
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

            {/* Form Content */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Class Name Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <label
                  htmlFor="class_name"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  🏫 Class Name
                </label>
                <input
                  type="text"
                  id="class_name"
                  name="class_name"
                  value={formData.class_name}
                  onChange={handleChange}
                  className="modern-input"
                  placeholder="Enter class name (e.g., 9-A, 10-B)"
                  required
                />
              </motion.div>

              {/* Grid Layout for Numeric Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Floor Number Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label
                    htmlFor="floor_number"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🏢 Floor Number
                  </label>
                  <input
                    type="number"
                    id="floor_number"
                    name="floor_number"
                    value={formData.floor_number}
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="1, 2, 3..."
                    min="0"
                    required
                  />
                </motion.div>

                {/* Level Grade Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="level_grade"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🎓 Grade Level
                  </label>
                  <input
                    type="number"
                    id="level_grade"
                    name="level_grade"
                    value={formData.level_grade}
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="9, 10, 11, 12"
                    min="9"
                    max="12"
                    required
                  />
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex justify-end gap-4 pt-6 border-t border-white/10 dark:border-gray-700/20"
              >
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
                  ✨ Save Class
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
