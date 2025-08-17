// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./constants";
import { User } from "@/types";

export function useAuth() {
  const router = useRouter();

  const login = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const data = await apiClient<{ token: string; user: User }>(
      API_ENDPOINTS.AUTH.SIGNIN,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );

    if (rememberMe) {
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
    } else {
      sessionStorage.setItem("token", data.data.token);
      sessionStorage.setItem("user", JSON.stringify(data.data.user));
    }

    return data.data.user;
  };

  const logout = async () => {
    try {
      // Call signout API first
      await apiClient(API_ENDPOINTS.AUTH.SIGNOUT, {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout API error:", error);
      // Proceed with client-side cleanup even if API fails
    }

    // Clear all auth storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    router.push("/");
  };

  const getCurrentUser = () => {
    const userString =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  return { login, logout, getCurrentUser, getToken };
}
