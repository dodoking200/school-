import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Class } from "@/types";
import { cn } from "@/lib/utils";

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (student: {
    id?: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birth_date: string;
    discount_percentage: number;
  }) => void;
  student?: {
    id: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birth_date: string;
    discount_percentage: number;
  } | null;
  title: string;
  classes?: Class[];
}

export default function StudentModal({
  isOpen,
  onClose,
  onSubmit,
  student,
  title,
  classes = [],
}: StudentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    grade_level: 9,
    class_name: "",
    phone: "",
    birth_date: "",
    discount_percentage: 0,
  });

  // Initialize form data when editing a student
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        grade_level: student.grade_level,
        class_name: student.class_name,
        phone: student.phone,
        birth_date: student.birth_date,
        discount_percentage: 0, // Default discount for existing students
      });
    } else {
      // Reset form when adding a new student
      setFormData({
        name: "",
        email: "",
        grade_level: 9,
        class_name: classes.length > 0 ? classes[0].class_name : "",
        phone: "",
        birth_date: "",
        discount_percentage: 0,
      });
    }
  }, [student, classes]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "grade_level" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(student ? { id: student.id } : {}),
      ...formData,
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
          className="relative w-full max-w-2xl"
        >
          <div
            className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)",
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
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Complete the form with student information</p>
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
              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="Enter student's full name"
                    required
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="student@example.com"
                    required
                  />
                </motion.div>

                {/* Grade Level Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label htmlFor="grade_level" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    🎓 Grade Level
                  </label>
                  <select
                    id="grade_level"
                    name="grade_level"
                    value={formData.grade_level}
                    onChange={handleChange}
                    className="modern-input"
                  >
                    <option value={9}>Grade 9 🌟</option>
                    <option value={10}>Grade 10 💫</option>
                    <option value={11}>Grade 11 ✨</option>
                    <option value={12}>Grade 12 🎯</option>
                  </select>
                </motion.div>

                {/* Class Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label htmlFor="class_name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    🏫 Class Assignment
                  </label>
                  <select
                    id="class_name"
                    name="class_name"
                    value={formData.class_name}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  >
                    {classes && classes.length > 0 ? (
                      classes.map((cls) => (
                        <option key={cls.id} value={cls.class_name}>
                          {cls.class_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No classes available</option>
                    )}
                  </select>
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label htmlFor="phone" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    📱 Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="modern-input"
                    placeholder="(555) 123-4567"
                    required
                  />
                </motion.div>

                {/* Birth Date Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label htmlFor="birth_date" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    🎂 Birth Date
                  </label>
                  <input
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  />
                </motion.div>
              </div>

              {/* Discount Field (Full Width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label htmlFor="discount_percentage" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  💰 Discount Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="discount_percentage"
                    name="discount_percentage"
                    min="0"
                    max="100"
                    value={formData.discount_percentage}
                    onChange={handleChange}
                    className="modern-input pr-12"
                    placeholder="0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-gray-400 font-semibold">
                    %
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
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
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  ✨ Save Student
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
