// components/LoginForm/useLoginForm.ts
import { useState } from "react";
import { loginSchema } from "@/lib/schema";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: undefined }));

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        email: formattedErrors.email?._errors.join(", ") || "",
        password: formattedErrors.password?._errors.join(", ") || "",
        // Preserve any existing general error
        general: undefined,
      });
      return false;
    }

    // Clear field validation errors but preserve any general errors
    setErrors((prev) => ({ ...prev, email: "", password: "" }));
    return true;
  };

  const submitForm = async (callback: () => Promise<void>) => {
    setIsLoading(true);
    // Clear previous errors
    setErrors({});

    try {
      await callback();
    } catch (err) {
      // Improved error handling with specific network error detection
      if (err instanceof TypeError && err.message.includes("fetch")) {
        // Network-related errors (offline, server unreachable, etc.)
        setErrors({
          general:
            "Network error. Please check your internet connection and try again.",
        });
      } else {
        // Generic error fallback
        setErrors({
          general:
            err instanceof Error
              ? err.message
              : "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isLoading,
    validateForm,
    submitForm,
  };
}
