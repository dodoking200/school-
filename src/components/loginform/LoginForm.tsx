// components/LoginForm/LoginForm.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useLoginForm } from "./useLoginForm";
import { FormFields } from "./FormFields";
import { RememberMeCheckbox } from "./RememberMeCheckbox";
import { SubmitButton } from "./SubmitButton";
import { ErrorText } from "./ErrorText";
import { useAuth } from "@/lib/useAuth"; // Updated import

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth(); // Use the login function from useAuth
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isLoading,
    validateForm,
    submitForm,
    rememberMe,
    setRememberMe,
  } = useLoginForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await submitForm(async () => {
      // Call the centralized login function
      const user = await login(email, password, rememberMe);

      // Redirect based on role
      switch (user.role) {
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
          <RememberMeCheckbox checked={rememberMe} onChange={setRememberMe} />
        </div>

        {errors.general && <ErrorText message={errors.general} />}

        <div>
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
}
