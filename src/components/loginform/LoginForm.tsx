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
    <div className="max-w-md w-full space-y-8">
      <div className="glass-card !p-10">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <div 
            className="w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center"
            style={{ background: "var(--gradient-primary)" }}
          >
            <span className="text-4xl">🎓</span>
          </div>
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--foreground)" }}
          >
            Welcome Back
          </h2>
          <p 
            className="text-sm"
            style={{ color: "var(--foreground-muted)" }}
          >
            Sign in to access your school dashboard
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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

          <div className="pt-4">
            <SubmitButton isLoading={isLoading} />
          </div>
        </form>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--card-border)" }}>
          <p className="text-xs text-center" style={{ color: "var(--foreground-muted)" }}>
            🔒 Your login is secured with industry-standard encryption
          </p>
        </div>
      </div>
    </div>
  );
}
