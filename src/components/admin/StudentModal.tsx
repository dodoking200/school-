import React, { useState, useEffect } from "react";
import { Class } from "@/types";

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
    birthdate: string;
    discount_percentage: number;
  }) => void;
  student?: {
    id: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birthdate: string;
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
    grade: 9,
    className: "",
    phone: "",
    birthdate: "",
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
        birthdate: student.birthdate,
        discount_percentage: 0, // Default discount for existing students
      });
    } else {
      // Reset form when adding a new student
      setFormData({
        name: "",
        email: "",
        grade: 9,
        className: classes.length > 0 ? classes[0].class_name : "",
        phone: "",
        birthdate: "",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="grade_level"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grade
            </label>
            <select
              id="grade_level"
              name="grade_level"
              value={formData.grade_level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value={9}>9</option>
              <option value={10}>10</option>
              <option value={11}>11</option>
              <option value={12}>12</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="class_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class Name
            </label>
            <select
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="birth_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Birthdate
            </label>
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="discount_percentage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Discount Percentage
            </label>
            <input
              type="number"
              id="discount_percentage"
              name="discount_percentage"
              min="0"
              max="100"
              value={formData.discount_percentage}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--primary)] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
