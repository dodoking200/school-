import { Role } from "@/types";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: {
    id?: number;
    name: string;
    email: string;
    role_id: number;
    phone: string;
    birthdate: string;
  }) => void;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
    phone: string;
    birthdate: string;
  } | null;
  title: string;
  roles: Role[];
}

export default function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  title,
  roles,
}: UserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role_id: 0 as number,
    phone: "",
    birthdate: "",
  });

  // Initialize form data when editing a user
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role_id: roles.find((r) => r.name === user.role)?.id || 0,
        phone: user.phone,
        birthdate: user.birthdate,
      });
    } else {
      // Reset form when adding a new user
      setFormData({
        name: "",
        email: "",
        role_id: 0, // Don't auto-select a role
        phone: "",
        birthdate: "",
      });
    }
  }, [user, roles]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "role_id" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    if (!formData.birthdate) {
      alert("Please select a birth date");
      return;
    }

    if (!formData.role_id || formData.role_id === 0) {
      alert("Please select a valid role");
      return;
    }

    onSubmit({
      ...(user ? { id: user.id } : {}),
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
                    Manage user account information
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
                    className="modern-input"
                    placeholder="Enter user's full name"
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
                    className="modern-input"
                    placeholder="user@example.com"
                    required
                  />
                </motion.div>

                {/* Role Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <label
                    htmlFor="role_id"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                  >
                    🗺️ User Role
                  </label>
                  <select
                    id="role_id"
                    name="role_id"
                    value={formData.role_id}
                    onChange={handleChange}
                    className="modern-input"
                    required
                  >
                    <option value={0}>Select a role...</option>
                    {roles.length > 0 ? (
                      roles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))
                    ) : (
                      <option value={0}>Loading roles...</option>
                    )}
                  </select>
                </motion.div>

                {/* Phone Field */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.45 }}
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
                    className="modern-input"
                    placeholder="(555) 123-4567"
                    required
                  />
                </motion.div>
              </div>

              {/* Birthdate Field (Full Width) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label
                  htmlFor="birthdate"
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2"
                >
                  🎂 Birth Date
                </label>
                <input
                  type="date"
                  id="birthdate"
                  name="birthdate"
                  value={formData.birthdate}
                  onChange={handleChange}
                  className="modern-input"
                  required
                />
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
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
                  ✨ Save User
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
