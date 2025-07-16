// src/ui/InputField.tsx
"use client";
import React from "react";

type InputType = "text" | "password" | "email";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: InputType;
}

export default function InputField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: InputFieldProps) {
  return (
    <div className="pt-4">
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>
      <input
        id={label}
        name={label}
        type={type}
        autoComplete={label}
        required
        className={`appearance-none rounded-lg relative block w-full px-3 py-3 border ${
          error ? "border-red-500" : "border-gray-300"
        } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[var(--primary)] focus:border-[var(--primary)] focus:z-10 sm:text-sm`}
        placeholder={`Enter your ${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
