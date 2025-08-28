import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Subject } from "@/types";
import { cn } from "@/lib/utils";

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (subject: { id?: number; name: string; grade: string }) => void;
  subject?: Subject | null;
  title: string;
  isLoading?: boolean;
}

export default function SubjectModal({
  isOpen,
  onClose,
  onSubmit,
  subject,
  title,
  isLoading = false,
}: SubjectModalProps) {
  const [formData, setFormData] = useState({ name: "", grade: "" });

  useEffect(() => {
    if (subject) {
      setFormData({ name: subject.name, grade: subject.grade || "" });
    } else {
      setFormData({ name: "", grade: "" });
    }
  }, [subject]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(subject ? { id: subject.id } : {}),
      ...formData,
    });
    // Don't close modal immediately - let parent component handle it after API call
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
          className="relative w-full max-w-xl"
        >
          <div className="bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/20 rounded-3xl shadow-2xl p-8">
            <motion.div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="w-3 h-8 bg-gradient-primary rounded-full" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Configure subject information</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                disabled={isLoading}
                className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-800/30 flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
              >
                <XMarkIcon className="w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.form onSubmit={handleSubmit} className="space-y-6">
              <motion.div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  📚 Subject Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="modern-input disabled:opacity-50"
                  placeholder="Mathematics, Science, etc."
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div>
                <label htmlFor="grade" className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  🎓 Grade Level
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="modern-input disabled:opacity-50"
                  required
                  disabled={isLoading}
                >
                  <option value="">Select Grade Level</option>
                  <option value="9">Grade 9 🌟</option>
                  <option value="10">Grade 10 💫</option>
                  <option value="11">Grade 11 ✨</option>
                  <option value="12">Grade 12 🎯</option>
                </select>
              </motion.div>

              <motion.div className="flex justify-end gap-4 pt-6 border-t border-white/10 dark:border-gray-700/20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-8 py-3 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                >
                  ❌ Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? "💾 Saving..." : "✨ Save Subject"}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
