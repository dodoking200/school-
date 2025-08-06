"use client";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User, Permission } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

interface AuthContextType {
  user: User | null;
  permissions: Permission[];
  isLoading: boolean;
  login: (user: User, permissions: Permission[]) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          // Assuming you have an endpoint to get the current user's profile
          const profileResponse = await apiClient<{
            user: User;
            permissions: Permission[];
          }>(API_ENDPOINTS.USERS.PROFILE);
          setUser(profileResponse.data.user);
          setPermissions(profileResponse.data.permissions);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          localStorage.removeItem("token"); // Invalid token
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User, userPermissions: Permission[]) => {
    setUser(userData);
    setPermissions(userPermissions);
  };

  const logout = () => {
    setUser(null);
    setPermissions([]);
    localStorage.removeItem("token");
  };

  const hasPermission = (permission: Permission) => {
    return permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{ user, permissions, isLoading, login, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
