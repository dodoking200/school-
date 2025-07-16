// components/LoginForm/useLoginForm.ts
import { useState } from "react";
import { loginSchema } from "@/lib/schema";

export function useLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return false;
    }

    setErrors({});
    return true;
  };

  const submitForm = async (callback: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await callback();
    } catch (err) {
      setErrors({
        email: "",
        password: err instanceof Error ? err.message : "Something went wrong",
      });
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
