import React, { useState, useEffect } from "react";
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
              htmlFor="class_name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Class Name
            </label>
            <input
              type="text"
              id="class_name"
              name="class_name"
              value={formData.class_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="floor_number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Floor Number
            </label>
            <input
              type="number"
              id="floor_number"
              name="floor_number"
              value={formData.floor_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="level_grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Level Grade
            </label>
            <input
              type="number"
              id="level_grade"
              name="level_grade"
              value={formData.level_grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
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
