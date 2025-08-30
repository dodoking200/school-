// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS } from "./constants";
import { User, Permission } from "@/types";

export function useAuth() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);

  // Load permissions from storage on mount
  useEffect(() => {
    const storedPermissions =
      localStorage.getItem("permissions") ||
      sessionStorage.getItem("permissions");
    if (storedPermissions) {
      setPermissions(JSON.parse(storedPermissions));
    }
  }, []);

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

    // Get user permissions after successful login
    try {
      const userProfile = await apiClient<{
        user: User;
        permissions: Permission[];
      }>(API_ENDPOINTS.USERS.GET_PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${data.data.token}`,
        },
      });

      const userPermissions = userProfile.data.permissions || [];
      setPermissions(userPermissions);

      if (rememberMe) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
        localStorage.setItem("permissions", JSON.stringify(userPermissions));
      } else {
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify(data.data.user));
        sessionStorage.setItem("permissions", JSON.stringify(userPermissions));
      }
    } catch (error) {
      console.error("Failed to fetch user permissions:", error);
      // Continue with login even if permissions fetch fails
      if (rememberMe) {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      } else {
        sessionStorage.setItem("token", data.data.token);
        sessionStorage.setItem("user", JSON.stringify(data.data.user));
      }
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
    localStorage.removeItem("permissions");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("permissions");

    // Clear permissions state
    setPermissions([]);

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

  const hasPermission = (permission: Permission): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.some((permission) =>
      permissions.includes(permission)
    );
  };

  const hasAllPermissions = (requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every((permission) =>
      permissions.includes(permission)
    );
  };

  return {
    login,
    logout,
    getCurrentUser,
    getToken,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}
