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
  const getIcon = () => {
    switch (type) {
      case "email": return "📧";
      case "password": return "🔒";
      default: return "📝";
    }
  };

  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-semibold mb-2"
        style={{ color: "var(--foreground)" }}
      >
        {getIcon()} {label}
      </label>
      <input
        id={label}
        name={label}
        type={type}
        autoComplete={label}
        required
        className={`modern-input w-full transition-all duration-300 ${
          error ? "!border-red-500 !ring-red-200" : ""
        }`}
        style={{
          borderColor: error ? "var(--danger)" : "var(--card-border)",
        }}
        placeholder={`Enter your ${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p className="text-sm mt-1 flex items-center gap-1" style={{ color: "var(--danger)" }}>
          <span>⚠️</span> {error}
        </p>
      )}
    </div>
  );
}
