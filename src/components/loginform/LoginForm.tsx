// components/LoginForm/LoginForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLoginForm } from "./useLoginForm";
import { FormFields } from "./FormFields";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { SubmitButton } from "./SubmitButton";
import { ErrorText } from "./ErrorText";
import { apiClient } from "@/lib/apiClient";
import { User } from "@/types";

export default function LoginForm() {
  const router = useRouter();
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    validateForm,
    submitForm,
  } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitForm(async () => {
      const data = await apiClient<{ token: string; user: User }>(
        "http://localhost:3000/users/signin",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        }
      );

      localStorage.setItem("token", data.data.token);
      // Get user role
      const role = data.data.user.role;

      // Redirect based on role
      switch (role) {
        case "student":
          router.push("/users/student");
          break;
        case "teacher":
          router.push("/users/teacher");
          break;
        default: // admin or unknown
          router.push("/users/admin");
      }
    });
  };

  return (
    <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Back
        </h2>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md -space-y-px">
          <FormFields
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            errors={errors}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <RememberMeCheckbox />
        </div>

        <ErrorText message={errors.password} />

        <div>
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
