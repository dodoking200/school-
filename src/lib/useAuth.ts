// hooks/useAuth.ts
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();

  const logout = () => {
    // Clear all auth storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  const getCurrentUser = () => {
    const userString =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return userString ? JSON.parse(userString) : null;
  };

  const getToken = () => {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  };

  return { logout, getCurrentUser, getToken };
}
