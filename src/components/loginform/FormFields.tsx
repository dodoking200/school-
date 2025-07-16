// components/LoginForm/FormFields.tsx
import React from "react";
import InputField from "@/components/ui/InputField";

interface FormFieldsProps {
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  errors: { email?: string; password?: string };
}

export function FormFields({
  email,
  setEmail,
  password,
  setPassword,
  errors,
}: FormFieldsProps) {
  return (
    <>
      <InputField
        label="Email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        type="email"
      />
      <InputField
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        type="password"
      />
    </>
  );
}
