import React, { useState, useEffect } from "react";
import { Class } from "@/types";

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (classData: Omit<Class, 'id'> & { id?: number }) => void;
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
  const [formData, setFormData] = useState({
    name: "",
    floor: 0,
    grade: 9,
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        name: classData.name,
        floor: classData.floor,
        grade: classData.grade,
      });
    } else {
      setFormData({
        name: "",
        floor: 0,
        grade: 9,
      });
    }
  }, [classData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "floor" || name === "grade" ? parseInt(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(classData ? { id: classData.id } : {}),
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
              htmlFor="floor"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Floor
            </label>
            <input
              type="number"
              id="floor"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grade
            </label>
            <input
              type="number"
              id="grade"
              name="grade"
              value={formData.grade}
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
