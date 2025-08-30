// lib/navigationUtils.ts
import { Permission } from '@/types';
import { USER_PERMISSIONS } from './constants';

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
  permissions?: Permission[];
  requireAll?: boolean; // If true, user needs all permissions. If false, user needs at least one
  children?: NavigationItem[];
  order?: number;
}

/**
 * Main navigation structure with permission requirements
 */
export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    permissions: [USER_PERMISSIONS.VIEW_DASHBOARD],
    order: 1,
  },
  {
    id: 'students',
    label: 'Students',
    href: '/students',
    icon: 'students',
    permissions: [USER_PERMISSIONS.MANAGE_STUDENTS],
    order: 2,
    children: [
      {
        id: 'students-list',
        label: 'All Students',
        href: '/students',
        permissions: [USER_PERMISSIONS.MANAGE_STUDENTS],
      },
      {
        id: 'students-add',
        label: 'Add Student',
        href: '/students/add',
        permissions: [USER_PERMISSIONS.MANAGE_STUDENTS],
      },
      {
        id: 'students-import',
        label: 'Import Students',
        href: '/students/import',
        permissions: [USER_PERMISSIONS.MANAGE_STUDENTS],
      },
    ],
  },
  {
    id: 'teachers',
    label: 'Teachers',
    href: '/teachers',
    icon: 'teachers',
    permissions: [USER_PERMISSIONS.MANAGE_TEACHERS],
    order: 3,
    children: [
      {
        id: 'teachers-list',
        label: 'All Teachers',
        href: '/teachers',
        permissions: [USER_PERMISSIONS.MANAGE_TEACHERS],
      },
      {
        id: 'teachers-add',
        label: 'Add Teacher',
        href: '/teachers/add',
        permissions: [USER_PERMISSIONS.MANAGE_TEACHERS],
      },
    ],
  },
  {
    id: 'classes',
    label: 'Classes',
    href: '/classes',
    icon: 'classes',
    permissions: [USER_PERMISSIONS.MANAGE_CLASSES],
    order: 4,
  },
  {
    id: 'subjects',
    label: 'Subjects',
    href: '/subjects',
    icon: 'subjects',
    permissions: [USER_PERMISSIONS.MANAGE_SUBJECTS],
    order: 5,
  },
  {
    id: 'schedules',
    label: 'Schedules',
    href: '/schedules',
    icon: 'schedules',
    permissions: [USER_PERMISSIONS.MANAGE_SCHEDULES, USER_PERMISSIONS.VIEW_OWN_SCHEDULE],
    requireAll: false, // User needs at least one of these permissions
    order: 6,
  },
  {
    id: 'exams',
    label: 'Exams',
    href: '/exams',
    icon: 'exams',
    permissions: [
      USER_PERMISSIONS.MANAGE_EXAMS,
      USER_PERMISSIONS.TAKE_EXAMS,
      USER_PERMISSIONS.VIEW_EXAM_RESULTS,
    ],
    requireAll: false,
    order: 7,
    children: [
      {
        id: 'exams-manage',
        label: 'Manage Exams',
        href: '/exams/manage',
        permissions: [USER_PERMISSIONS.MANAGE_EXAMS],
      },
      {
        id: 'exams-take',
        label: 'Take Exams',
        href: '/exams/take',
        permissions: [USER_PERMISSIONS.TAKE_EXAMS],
      },
      {
        id: 'exams-results',
        label: 'Exam Results',
        href: '/exams/results',
        permissions: [USER_PERMISSIONS.VIEW_EXAM_RESULTS],
      },
      {
        id: 'questions',
        label: 'Question Bank',
        href: '/questions',
        permissions: [USER_PERMISSIONS.MANAGE_QUESTIONS],
      },
    ],
  },
  {
    id: 'grades',
    label: 'Grades',
    href: '/grades',
    icon: 'grades',
    permissions: [USER_PERMISSIONS.MANAGE_GRADES, USER_PERMISSIONS.VIEW_OWN_GRADES],
    requireAll: false,
    order: 8,
  },
  {
    id: 'attendance',
    label: 'Attendance',
    href: '/attendance',
    icon: 'attendance',
    permissions: [
      USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE,
      USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE,
      USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
    ],
    requireAll: false,
    order: 9,
    children: [
      {
        id: 'attendance-students',
        label: 'Student Attendance',
        href: '/attendance/students',
        permissions: [USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE],
      },
      {
        id: 'attendance-staff',
        label: 'Staff Attendance',
        href: '/attendance/staff',
        permissions: [USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE],
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        href: '/attendance/reports',
        permissions: [USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS],
      },
    ],
  },
  {
    id: 'behaviors',
    label: 'Behaviors',
    href: '/behaviors',
    icon: 'behaviors',
    permissions: [USER_PERMISSIONS.MANAGE_BEHAVIORS, USER_PERMISSIONS.VIEW_OWN_BEHAVIORS],
    requireAll: false,
    order: 10,
  },
  {
    id: 'payments',
    label: 'Payments',
    href: '/payments',
    icon: 'payments',
    permissions: [
      USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS,
      USER_PERMISSIONS.VIEW_PAYMENT_REPORTS,
    ],
    requireAll: false,
    order: 11,
    children: [
      {
        id: 'payments-manage',
        label: 'Manage Payments',
        href: '/payments/manage',
        permissions: [USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS],
      },
      {
        id: 'payments-reports',
        label: 'Payment Reports',
        href: '/payments/reports',
        permissions: [USER_PERMISSIONS.VIEW_PAYMENT_REPORTS],
      },
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    href: '/notifications',
    icon: 'notifications',
    permissions: [USER_PERMISSIONS.VIEW_NOTIFICATIONS],
    order: 12,
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: 'settings',
    permissions: [
      USER_PERMISSIONS.MANAGE_USERS,
      USER_PERMISSIONS.MANAGE_ROLES,
      USER_PERMISSIONS.MANAGE_PERMISSIONS,
      USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS,
    ],
    requireAll: false,
    order: 13,
    children: [
      {
        id: 'settings-users',
        label: 'User Management',
        href: '/settings/users',
        permissions: [USER_PERMISSIONS.MANAGE_USERS],
      },
      {
        id: 'settings-roles',
        label: 'Role Management',
        href: '/settings/roles',
        permissions: [USER_PERMISSIONS.MANAGE_ROLES],
      },
      {
        id: 'settings-permissions',
        label: 'Permissions',
        href: '/settings/permissions',
        permissions: [USER_PERMISSIONS.MANAGE_PERMISSIONS],
      },
      {
        id: 'settings-academic',
        label: 'Academic Years',
        href: '/settings/academic-years',
        permissions: [USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS],
      },
    ],
  },
];

/**
 * Filter navigation items based on user permissions
 */
export const filterNavigationByPermissions = (
  items: NavigationItem[],
  userPermissions: Permission[]
): NavigationItem[] => {
  return items
    .filter(item => {
      // If no permissions required, show the item
      if (!item.permissions || item.permissions.length === 0) {
        return true;
      }

      // Check if user has required permissions
      if (item.requireAll) {
        return item.permissions.every(permission => userPermissions.includes(permission));
      } else {
        return item.permissions.some(permission => userPermissions.includes(permission));
      }
    })
    .map(item => ({
      ...item,
      children: item.children 
        ? filterNavigationByPermissions(item.children, userPermissions)
        : undefined,
    }))
    .filter(item => {
      // Remove items that have no accessible children (if they have children)
      if (item.children && item.children.length === 0) {
        return false;
      }
      return true;
    })
    .sort((a, b) => (a.order || 999) - (b.order || 999));
};

/**
 * Get breadcrumb items for a given path
 */
export const getBreadcrumbs = (
  pathname: string,
  userPermissions: Permission[]
): NavigationItem[] => {
  const breadcrumbs: NavigationItem[] = [];
  const pathSegments = pathname.split('/').filter(segment => segment);

  let currentPath = '';
  
  for (const segment of pathSegments) {
    currentPath += `/${segment}`;
    
    // Find matching navigation item
    const findItemByPath = (items: NavigationItem[]): NavigationItem | undefined => {
      for (const item of items) {
        if (item.href === currentPath) {
          return item;
        }
        if (item.children) {
          const childItem = findItemByPath(item.children);
          if (childItem) return childItem;
        }
      }
      return undefined;
    };

    const item = findItemByPath(navigationItems);
    if (item) {
      // Check if user has permission to see this breadcrumb
      if (!item.permissions || item.permissions.length === 0) {
        breadcrumbs.push(item);
      } else {
        const hasPermission = item.requireAll
          ? item.permissions.every(permission => userPermissions.includes(permission))
          : item.permissions.some(permission => userPermissions.includes(permission));
        
        if (hasPermission) {
          breadcrumbs.push(item);
        }
      }
    }
  }

  return breadcrumbs;
};

/**
 * Get quick action items based on user role/permissions
 */
export const getQuickActions = (userPermissions: Permission[]): NavigationItem[] => {
  const quickActions: NavigationItem[] = [
    {
      id: 'add-student',
      label: 'Add Student',
      href: '/students/add',
      permissions: [USER_PERMISSIONS.MANAGE_STUDENTS],
    },
    {
      id: 'add-teacher',
      label: 'Add Teacher',
      href: '/teachers/add',
      permissions: [USER_PERMISSIONS.MANAGE_TEACHERS],
    },
    {
      id: 'create-exam',
      label: 'Create Exam',
      href: '/exams/create',
      permissions: [USER_PERMISSIONS.MANAGE_EXAMS],
    },
    {
      id: 'record-attendance',
      label: 'Record Attendance',
      href: '/attendance/record',
      permissions: [USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE],
    },
    {
      id: 'add-payment',
      label: 'Add Payment',
      href: '/payments/add',
      permissions: [USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS],
    },
    {
      id: 'create-notification',
      label: 'Send Notification',
      href: '/notifications/create',
      permissions: [USER_PERMISSIONS.MANAGE_NOTIFICATIONS],
    },
  ];

  return filterNavigationByPermissions(quickActions, userPermissions);
};

/**
 * Get sidebar navigation items for different user roles
 */
export const getSidebarNavigation = (userPermissions: Permission[]): NavigationItem[] => {
  return filterNavigationByPermissions(navigationItems, userPermissions);
};

/**
 * Check if a specific route is accessible to user
 */
export const isRouteAccessible = (
  pathname: string,
  userPermissions: Permission[]
): boolean => {
  const findItemByPath = (items: NavigationItem[]): NavigationItem | undefined => {
    for (const item of items) {
      if (item.href === pathname) {
        return item;
      }
      if (item.children) {
        const childItem = findItemByPath(item.children);
        if (childItem) return childItem;
      }
    }
    return undefined;
  };

  const item = findItemByPath(navigationItems);
  if (!item) return true; // Route not defined in navigation, allow access

  if (!item.permissions || item.permissions.length === 0) return true;

  if (item.requireAll) {
    return item.permissions.every(permission => userPermissions.includes(permission));
  } else {
    return item.permissions.some(permission => userPermissions.includes(permission));
  }
};

/**
 * Get home page route based on user role
 */
export const getHomeRoute = (userPermissions: Permission[]): string => {
  // Admin and managers go to dashboard
  if (userPermissions.includes(USER_PERMISSIONS.MANAGE_PERMISSIONS) ||
      userPermissions.includes(USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS)) {
    return '/dashboard';
  }

  // Teachers go to dashboard
  if (userPermissions.includes(USER_PERMISSIONS.MANAGE_EXAMS) ||
      userPermissions.includes(USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE)) {
    return '/dashboard';
  }

  // Accountants go to payments or dashboard
  if (userPermissions.includes(USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS)) {
    return '/payments';
  }

  // Students go to their specific area
  if (userPermissions.includes(USER_PERMISSIONS.STUDENT_MOBILE_APP)) {
    return '/student/dashboard';
  }

  // Default fallback
  return '/dashboard';
};

/**
 * Get available mobile app routes for user
 */
export const getMobileAppRoutes = (userPermissions: Permission[]): string[] => {
  const routes: string[] = [];

  if (userPermissions.includes(USER_PERMISSIONS.STUDENT_MOBILE_APP)) {
    routes.push('/mobile/student');
  }

  if (userPermissions.includes(USER_PERMISSIONS.ATTENDANCE_MOBILE_APP)) {
    routes.push('/mobile/attendance');
  }

  return routes;
};

export default {
  navigationItems,
  filterNavigationByPermissions,
  getBreadcrumbs,
  getQuickActions,
  getSidebarNavigation,
  isRouteAccessible,
  getHomeRoute,
  getMobileAppRoutes,
};
