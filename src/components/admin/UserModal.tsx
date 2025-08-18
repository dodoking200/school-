import { Role } from "@/types";
import React, { useState, useEffect } from "react";

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
        role_id: roles.length > 0 ? roles[0].id : 0,
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
              htmlFor="role_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <select
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
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
