"use client";

import { useAuth } from "@/lib/useAuth";
import { Permission } from "@/types";
import { ReactNode } from "react";
import { USER_PERMISSIONS } from "./constants";

interface CanProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
}

/**
 * Can component for conditional rendering based on user permissions
 *
 * @example
 * // Single permission check
 * <Can permission="create_students">
 *   <button>Add Student</button>
 * </Can>
 *
 * @example
 * // Multiple permissions - user needs ANY of the permissions
 * <Can permissions={["edit_students", "delete_students"]}>
 *   <div>Student Management</div>
 * </Can>
 *
 * @example
 * // Multiple permissions - user needs ALL permissions
 * <Can permissions={["view_students", "edit_students"]} requireAll={true}>
 *   <div>Full Student Access</div>
 * </Can>
 *
 * @example
 * // With custom fallback
 * <Can permission="admin_access" fallback={<div>Access Denied</div>}>
 *   <AdminPanel />
 * </Can>
 */
export function Can({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}: CanProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  // If single permission is provided
  if (permission && !permissions) {
    if (!hasPermission(permission)) {
      return fallback;
    }
  }

  // If multiple permissions are provided
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // User must have ALL permissions
      if (!hasAllPermissions(permissions)) {
        return fallback;
      }
    } else {
      // User must have ANY of the permissions
      if (!hasAnyPermission(permissions)) {
        return fallback;
      }
    }
  }

  // If no permissions specified, show children (for backward compatibility)
  if (!permission && (!permissions || permissions.length === 0)) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
