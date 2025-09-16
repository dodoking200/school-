import { Subject, Teacher, TeacherCreatePayload } from "@/types";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacher: Teacher | TeacherCreatePayload) => Promise<void>;
  teacher?: Teacher | null;
  title: string;
  subjects: Subject[];
  isLoading?: boolean;
}

export default function TeacherModal({
  isOpen,
  onClose,
  onSubmit,
  teacher,
  title,
  subjects,
  isLoading = false,
}: TeacherModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birth_date: "",
    specialization: "",
    hire_date: "",
    qualification: "",
    subject_ids: [] as number[],
  });

  // Initialize form data when editing a teacher
  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        birth_date: teacher.birth_date,
        specialization: teacher.specialization || "",
        hire_date: teacher.hire_date || "",
        qualification: teacher.qualification || "",
        subject_ids: teacher.subjects ? teacher.subjects.map((s) => s.id) : [],
      });
    } else {
      // Reset form when adding a new teacher
      setFormData({
        name: "",
        email: "",
        phone: "",
        birth_date: "",
        specialization: "",
        hire_date: "",
        qualification: "",
        subject_ids: [],
      });
    }
  }, [teacher]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubjectsChange = (id: number) => {
    setFormData((prev) => {
      const exists = prev.subject_ids.includes(id);
      return {
        ...prev,
        subject_ids: exists
          ? prev.subject_ids.filter((sid) => sid !== id)
          : [...prev.subject_ids, id],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name || formData.name.length < 3) {
      alert("Name must be at least 3 characters long");
      return;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      alert("Phone number must be at least 10 characters long");
      return;
    }

    if (!formData.birth_date) {
      alert("Please select a birth date");
      return;
    }

    if (!formData.specialization) {
      alert("Please enter a specialization");
      return;
    }

    if (!formData.qualification) {
      alert("Please enter a qualification");
      return;
    }

    if (!formData.hire_date) {
      alert("Please select a hire date");
      return;
    }

    if (formData.subject_ids.length === 0) {
      alert("Please select at least one subject");
      return;
    }

    try {
      await onSubmit({
        ...(teacher ? { id: teacher.id } : {}),
        ...formData,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting teacher data:", error);
      // Don't close modal on error, let the parent component handle it
    }
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
          className="relative w-full max-w-3xl"
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
                    Complete the form with teacher information
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
              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    👤 Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter teacher's full name"
                    required
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="teacher@example.com"
                    required
                  />
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    📱 Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="(555) 123-4567"
                    required
                  />
                </motion.div>

                {/* Birth Date Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <label
                    htmlFor="birth_date"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🎂 Birth Date
                  </label>
                  <input
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                  />
                </motion.div>

                {/* Specialization Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label
                    htmlFor="specialization"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🎯 Specialization
                  </label>
                  <input
                    type="text"
                    id="specialization"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Mathematics, Science, etc."
                    required
                  />
                </motion.div>

                {/* Qualification Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <label
                    htmlFor="qualification"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🎓 Qualification
                  </label>
                  <input
                    type="text"
                    id="qualification"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Bachelor's, Master's, PhD, etc."
                    required
                  />
                </motion.div>
              </div>

              {/* Hire Date Field (Full Width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label
                  htmlFor="hire_date"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  📅 Hire Date
                </label>
                <input
                  type="date"
                  id="hire_date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="modern-input disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                />
              </motion.div>

              {/* Subjects Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
              >
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  📚 Subjects
                </label>
                <div className="max-h-40 overflow-auto bg-white/5 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {subjects.map((s) => (
                      <motion.label
                        key={s.id}
                        className="flex items-center space-x-2 py-2 px-3 rounded-xl hover:bg-white/10 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.subject_ids.includes(s.id)}
                          onChange={() => handleSubjectsChange(s.id)}
                          disabled={isLoading}
                          className="w-4 h-4 text-primary bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-primary dark:focus:ring-primary focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <span className="text-gray-700 dark:text-gray-200 font-medium">
                          {s.name}
                        </span>
                      </motion.label>
                    ))}
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
                  disabled={isLoading}
                  className="px-8 py-3 bg-white/10 dark:bg-gray-800/20 border border-white/20 dark:border-gray-700/20 rounded-2xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-gray-700/30 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                  disabled={isLoading}
                  className="px-8 py-3 bg-gradient-primary text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "💾 Saving..." : "✨ Save Teacher"}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
