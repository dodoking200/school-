// components/common/PermissionGuard.tsx
import React from 'react';
import { useAuth } from '@/lib/useAuth';
import { Permission } from '@/types';

interface PermissionGuardProps {
  children: React.ReactNode;
  /** Single permission required to view content */
  permission?: Permission;
  /** Array of permissions - user needs at least one */
  anyPermissions?: Permission[];
  /** Array of permissions - user needs all */
  allPermissions?: Permission[];
  /** Fallback content to show when user lacks permissions */
  fallback?: React.ReactNode;
  /** If true, shows nothing when user lacks permissions (default: true) */
  hideWhenNoAccess?: boolean;
}

/**
 * PermissionGuard component provides conditional rendering based on user permissions.
 * 
 * @example
 * // Show content only if user can manage students
 * <PermissionGuard permission={USER_PERMISSIONS.MANAGE_STUDENTS}>
 *   <AddStudentButton />
 * </PermissionGuard>
 * 
 * @example
 * // Show content if user has any of the specified permissions
 * <PermissionGuard anyPermissions={[
 *   USER_PERMISSIONS.MANAGE_EXAMS,
 *   USER_PERMISSIONS.TAKE_EXAMS
 * ]}>
 *   <ExamSection />
 * </PermissionGuard>
 * 
 * @example
 * // Show content only if user has all specified permissions
 * <PermissionGuard allPermissions={[
 *   USER_PERMISSIONS.MANAGE_STUDENTS,
 *   USER_PERMISSIONS.MANAGE_CLASSES
 * ]}>
 *   <AdminPanel />
 * </PermissionGuard>
 * 
 * @example
 * // Show fallback content when user lacks permissions
 * <PermissionGuard 
 *   permission={USER_PERMISSIONS.VIEW_DASHBOARD}
 *   fallback={<div>Access Denied</div>}
 * >
 *   <Dashboard />
 * </PermissionGuard>
 */
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  anyPermissions,
  allPermissions,
  fallback,
  hideWhenNoAccess = true,
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  let hasAccess = false;

  // Check permission access based on provided props
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasAccess = hasAnyPermission(anyPermissions);
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAllPermissions(allPermissions);
  } else {
    // If no permissions specified, allow access
    hasAccess = true;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (hideWhenNoAccess) {
    return null;
  }

  return <>{children}</>;
};

/**
 * Hook for permission-based conditional logic in components
 * 
 * @example
 * const canEdit = usePermissionCheck(USER_PERMISSIONS.MANAGE_STUDENTS);
 * const canDoAny = usePermissionCheck(null, [USER_PERMISSIONS.MANAGE_EXAMS, USER_PERMISSIONS.TAKE_EXAMS]);
 * const canDoAll = usePermissionCheck(null, null, [USER_PERMISSIONS.MANAGE_STUDENTS, USER_PERMISSIONS.MANAGE_CLASSES]);
 */
export const usePermissionCheck = (
  permission?: Permission,
  anyPermissions?: Permission[],
  allPermissions?: Permission[]
): boolean => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = useAuth();

  if (permission) {
    return hasPermission(permission);
  }
  
  if (anyPermissions && anyPermissions.length > 0) {
    return hasAnyPermission(anyPermissions);
  }
  
  if (allPermissions && allPermissions.length > 0) {
    return hasAllPermissions(allPermissions);
  }

  return true; // No permissions specified, allow access
};

export default PermissionGuard;
