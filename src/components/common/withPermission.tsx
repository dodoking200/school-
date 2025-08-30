// components/common/withPermission.tsx
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/useAuth';
import { Permission } from '@/types';

interface WithPermissionOptions {
  /** Single permission required to access the page */
  permission?: Permission;
  /** Array of permissions - user needs at least one */
  anyPermissions?: Permission[];
  /** Array of permissions - user needs all */
  allPermissions?: Permission[];
  /** Redirect path when user lacks permissions (default: '/dashboard') */
  redirectTo?: string;
  /** Custom component to show when user lacks permissions */
  unauthorizedComponent?: React.ComponentType;
  /** If true, shows loading while checking permissions */
  showLoading?: boolean;
}

/**
 * Higher-order component that protects pages with permission requirements.
 * Automatically redirects unauthorized users to a specified route.
 * 
 * @example
 * // Protect a page that requires student management permissions
 * export default withPermission(StudentsPage, {
 *   permission: USER_PERMISSIONS.MANAGE_STUDENTS,
 *   redirectTo: '/dashboard'
 * });
 * 
 * @example
 * // Protect a page that requires any exam-related permission
 * export default withPermission(ExamsPage, {
 *   anyPermissions: [
 *     USER_PERMISSIONS.MANAGE_EXAMS,
 *     USER_PERMISSIONS.TAKE_EXAMS,
 *     USER_PERMISSIONS.VIEW_EXAM_RESULTS
 *   ]
 * });
 * 
 * @example
 * // Protect a page that requires multiple permissions
 * export default withPermission(AdminPanel, {
 *   allPermissions: [
 *     USER_PERMISSIONS.MANAGE_USERS,
 *     USER_PERMISSIONS.MANAGE_ROLES
 *   ],
 *   unauthorizedComponent: AccessDeniedPage
 * });
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithPermissionOptions = {}
) {
  const {
    permission,
    anyPermissions,
    allPermissions,
    redirectTo = '/dashboard',
    unauthorizedComponent: UnauthorizedComponent,
    showLoading = true,
  } = options;

  const PermissionProtectedComponent: React.FC<P> = (props) => {
    const router = useRouter();
    const { 
      hasPermission, 
      hasAnyPermission, 
      hasAllPermissions, 
      getToken,
      getCurrentUser 
    } = useAuth();
    const [isChecking, setIsChecking] = React.useState(true);
    const [hasAccess, setHasAccess] = React.useState(false);

    useEffect(() => {
      const checkPermissions = () => {
        // Check if user is authenticated
        const token = getToken();
        const user = getCurrentUser();
        
        if (!token || !user) {
          router.push('/');
          return;
        }

        let accessGranted = false;

        // Check permission access based on provided options
        if (permission) {
          accessGranted = hasPermission(permission);
        } else if (anyPermissions && anyPermissions.length > 0) {
          accessGranted = hasAnyPermission(anyPermissions);
        } else if (allPermissions && allPermissions.length > 0) {
          accessGranted = hasAllPermissions(allPermissions);
        } else {
          // If no permissions specified, allow access
          accessGranted = true;
        }

        setHasAccess(accessGranted);
        setIsChecking(false);

        // Redirect if no access and no custom unauthorized component
        if (!accessGranted && !UnauthorizedComponent) {
          router.push(redirectTo);
        }
      };

      checkPermissions();
    }, [
      permission,
      anyPermissions,
      allPermissions,
      hasPermission,
      hasAnyPermission,
      hasAllPermissions,
      getToken,
      getCurrentUser,
      router,
      redirectTo,
      UnauthorizedComponent,
    ]);

    // Show loading while checking permissions
    if (isChecking && showLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    // Show unauthorized component if specified and user has no access
    if (!hasAccess && UnauthorizedComponent) {
      return <UnauthorizedComponent />;
    }

    // If user has access, render the wrapped component
    if (hasAccess) {
      return <WrappedComponent {...props} />;
    }

    // Default: don't render anything (redirect should have happened)
    return null;
  };

  // Set display name for debugging
  PermissionProtectedComponent.displayName = `withPermission(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return PermissionProtectedComponent;
}

/**
 * Default unauthorized page component
 */
export const DefaultUnauthorizedPage: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">
          You don't have the necessary permissions to access this page.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Go Back
        </button>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Dashboard
        </button>
      </div>
    </div>
  );
};

export default withPermission;
