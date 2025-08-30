// hooks/useAuth.ts
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiClient } from "./apiClient";
import { API_ENDPOINTS, USER_PERMISSIONS } from "./constants";
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

  // ================================================================
  // ROLE-BASED PERMISSION HELPERS
  // ================================================================
  
  const isStudent = (): boolean => {
    return hasPermission(USER_PERMISSIONS.STUDENT_MOBILE_APP);
  };

  const isTeacher = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_EXAMS) ||
           hasPermission(USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE);
  };

  const isManager = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS) ||
           hasPermission(USER_PERMISSIONS.MANAGE_CLASSES);
  };

  const isAccountant = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS);
  };

  const isAdmin = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_PERMISSIONS);
  };

  // ================================================================
  // FEATURE-SPECIFIC PERMISSION HELPERS
  // ================================================================

  // Academic Management
  const canManageAcademics = (): boolean => {
    return hasAnyPermission([
      USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS,
      USER_PERMISSIONS.MANAGE_SUBJECTS,
      USER_PERMISSIONS.MANAGE_CLASSES,
      USER_PERMISSIONS.MANAGE_SCHEDULES,
    ]);
  };

  // Student Management
  const canManageStudents = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_STUDENTS);
  };

  // Assessment System
  const canManageExams = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_EXAMS);
  };

  const canTakeExams = (): boolean => {
    return hasPermission(USER_PERMISSIONS.TAKE_EXAMS);
  };

  const canViewExamResults = (): boolean => {
    return hasPermission(USER_PERMISSIONS.VIEW_EXAM_RESULTS);
  };

  const canManageGrades = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_GRADES);
  };

  // Attendance System
  const canManageAttendance = (): boolean => {
    return hasAnyPermission([
      USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE,
      USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE,
    ]);
  };

  const canViewAttendanceReports = (): boolean => {
    return hasPermission(USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS);
  };

  // Financial System
  const canManagePayments = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS);
  };

  const canViewPaymentReports = (): boolean => {
    return hasPermission(USER_PERMISSIONS.VIEW_PAYMENT_REPORTS);
  };

  // Behavior Management
  const canManageBehaviors = (): boolean => {
    return hasPermission(USER_PERMISSIONS.MANAGE_BEHAVIORS);
  };

  const canViewOwnBehaviors = (): boolean => {
    return hasPermission(USER_PERMISSIONS.VIEW_OWN_BEHAVIORS);
  };

  // Dashboard Access
  const canViewDashboard = (): boolean => {
    return hasPermission(USER_PERMISSIONS.VIEW_DASHBOARD);
  };

  // Mobile App Access
  const canUseStudentMobileApp = (): boolean => {
    return hasPermission(USER_PERMISSIONS.STUDENT_MOBILE_APP);
  };

  const canUseAttendanceMobileApp = (): boolean => {
    return hasPermission(USER_PERMISSIONS.ATTENDANCE_MOBILE_APP);
  };

  // Data Export
  const canExportData = (): boolean => {
    return hasPermission(USER_PERMISSIONS.EXPORT_DATA);
  };

  // System Management
  const canManageSystem = (): boolean => {
    return hasAnyPermission([
      USER_PERMISSIONS.MANAGE_PERMISSIONS,
      USER_PERMISSIONS.MANAGE_ROLES,
      USER_PERMISSIONS.MANAGE_USERS,
    ]);
  };

  // ================================================================
  // PERMISSION UTILITIES
  // ================================================================

  const getPermissionNames = (): string[] => {
    return permissions.map(p => p.toString());
  };

  const getUserRole = (): string => {
    if (isAdmin()) return 'admin';
    if (isManager()) return 'manager';
    if (isTeacher()) return 'teacher';
    if (isAccountant()) return 'accountant';
    if (isStudent()) return 'student';
    return 'unknown';
  };

  const refreshPermissions = async (): Promise<void> => {
    try {
      const token = getToken();
      if (!token) return;

      const userProfile = await apiClient<{
        user: User;
        permissions: Permission[];
      }>(API_ENDPOINTS.USERS.GET_PROFILE, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userPermissions = userProfile.data.permissions || [];
      setPermissions(userPermissions);

      // Update storage
      const storage = localStorage.getItem("token") ? localStorage : sessionStorage;
      storage.setItem("permissions", JSON.stringify(userPermissions));
    } catch (error) {
      console.error("Failed to refresh user permissions:", error);
    }
  };

  return {
    // Core auth methods
    login,
    logout,
    getCurrentUser,
    getToken,
    permissions,
    
    // Basic permission checks
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    
    // Role identification
    isStudent,
    isTeacher,
    isManager,
    isAccountant,
    isAdmin,
    
    // Feature-specific permission checks
    canManageAcademics,
    canManageStudents,
    canManageExams,
    canTakeExams,
    canViewExamResults,
    canManageGrades,
    canManageAttendance,
    canViewAttendanceReports,
    canManagePayments,
    canViewPaymentReports,
    canManageBehaviors,
    canViewOwnBehaviors,
    canViewDashboard,
    canUseStudentMobileApp,
    canUseAttendanceMobileApp,
    canExportData,
    canManageSystem,
    
    // Utilities
    getPermissionNames,
    getUserRole,
    refreshPermissions,
  };
}
