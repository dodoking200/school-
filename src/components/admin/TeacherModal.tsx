import React, { useState, useEffect } from "react";

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (teacher: any) => void;
  teacher?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    subjects: string[];
    subject_ids?: number[];
    specialization?: string;
    hire_date?: string;
    qualification?: string;
  } | null;
  title: string;
}

export default function TeacherModal({
  isOpen,
  onClose,
  onSubmit,
  teacher,
  title,
}: TeacherModalProps) {
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    specialization: "",
    hire_date: "",
    qualification: "",
    subject_ids: [] as number[],
  });
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([]);

  // Fetch subjects and initialize form
  useEffect(() => {
    const load = async () => {
      const { subjectService } = await import("@/lib/services/subjectService");
      const list = await subjectService.getSubjectsList();
      setSubjects(list);
    };
    load();
  }, []);

  useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        birthdate: teacher.birthdate,
        specialization: teacher.specialization || "",
        hire_date: teacher.hire_date || "",
        qualification: teacher.qualification || "",
        subject_ids: teacher.subject_ids || [],
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        birthdate: "",
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
    setFormData((prev: any) => {
      const exists = prev.subject_ids.includes(id);
      return {
        ...prev,
        subject_ids: exists
          ? prev.subject_ids.filter((sid: number) => sid !== id)
          : [...prev.subject_ids, id],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(teacher ? { id: teacher.id } : {}),
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

          <div className="mb-4">
            <label
              htmlFor="birthdate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Birthdate
            </label>
            <input
              type="date"
              id="birthdate"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <label htmlFor="qualification" className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
              <input
                type="text"
                id="qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700 mb-1">Hire date</label>
            <input
              type="date"
              id="hire_date"
              name="hire_date"
              value={formData.hire_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              required
            />
          </div>

          <div className="mb-6">
            <div className="block text-sm font-medium text-gray-700 mb-1">Subjects</div>
            <div className="max-h-40 overflow-auto border rounded p-2">
              {subjects.map((s) => (
                <label key={s.id} className="flex items-center space-x-2 py-1">
                  <input
                    type="checkbox"
                    checked={formData.subject_ids.includes(s.id)}
                    onChange={() => handleSubjectsChange(s.id)}
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
