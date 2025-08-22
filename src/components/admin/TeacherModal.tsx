import { Subject, Teacher, TeacherCreatePayload } from "@/types";
import React, { useState, useEffect } from "react";

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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="mb-4">
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
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="specialization"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label
                htmlFor="qualification"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Qualification
              </label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="hire_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Hire date
            </label>
            <input
              type="date"
              id="hire_date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          </div>

          <div className="mb-6">
            <div className="block text-sm font-medium text-gray-700 mb-1">
              Subjects
            </div>
            <div className="max-h-40 overflow-auto border rounded p-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    checked={formData.subject_ids.includes(s.id)}
                    onChange={() => handleSubjectsChange(s.id)}
                    disabled={isLoading}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[var(--primary)] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
